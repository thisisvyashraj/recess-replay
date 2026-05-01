
-- ============ ENUMS ============
CREATE TYPE public.room_status AS ENUM ('waiting', 'in_progress', 'finished');
CREATE TYPE public.notif_kind AS ENUM ('announcement', 'room_invite', 'game_result', 'system');

-- ============ ROOMS ============
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_key TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  round_seconds INT NOT NULL DEFAULT 20,
  total_rounds INT NOT NULL DEFAULT 10,
  subjects TEXT[] DEFAULT '{}',
  status room_status NOT NULL DEFAULT 'waiting',
  current_round INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE INDEX rooms_status_idx ON public.rooms(status);
CREATE INDEX rooms_code_idx ON public.rooms(code);

-- ============ ROOM PLAYERS ============
CREATE TABLE public.room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  is_eliminated BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;
CREATE INDEX room_players_room_idx ON public.room_players(room_id);

-- ============ ROOM MEMBERSHIP HELPER ============
CREATE OR REPLACE FUNCTION public.is_room_member(_room_id UUID, _user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.room_players WHERE room_id = _room_id AND user_id = _user_id)
$$;
REVOKE EXECUTE ON FUNCTION public.is_room_member(UUID, UUID) FROM PUBLIC, anon;

CREATE OR REPLACE FUNCTION public.is_room_host(_room_id UUID, _user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.rooms WHERE id = _room_id AND host_id = _user_id)
$$;
REVOKE EXECUTE ON FUNCTION public.is_room_host(UUID, UUID) FROM PUBLIC, anon;

-- ============ GAME ROUNDS ============
CREATE TABLE public.game_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  round_number INT NOT NULL,
  question_id UUID,
  prompt JSONB NOT NULL,
  correct_answer TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  finished BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (room_id, round_number)
);
ALTER TABLE public.game_rounds ENABLE ROW LEVEL SECURITY;
CREATE INDEX game_rounds_room_idx ON public.game_rounds(room_id);

-- ============ ROUND ANSWERS ============
CREATE TABLE public.round_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES public.game_rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  points INT NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (round_id, user_id)
);
ALTER TABLE public.round_answers ENABLE ROW LEVEL SECURITY;

-- ============ ROOM POLICIES ============
CREATE POLICY "rooms_read_member_or_public" ON public.rooms FOR SELECT TO authenticated
  USING (is_public OR host_id = auth.uid() OR public.is_room_member(id, auth.uid()));
CREATE POLICY "rooms_insert_self" ON public.rooms FOR INSERT TO authenticated
  WITH CHECK (host_id = auth.uid());
CREATE POLICY "rooms_update_host" ON public.rooms FOR UPDATE TO authenticated
  USING (host_id = auth.uid());
CREATE POLICY "rooms_delete_host" ON public.rooms FOR DELETE TO authenticated
  USING (host_id = auth.uid());

-- ============ ROOM PLAYER POLICIES ============
CREATE POLICY "rp_select_visible" ON public.room_players FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_room_member(room_id, auth.uid())
    OR public.is_room_host(room_id, auth.uid())
  );
CREATE POLICY "rp_insert_self" ON public.room_players FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "rp_update_self_or_host" ON public.room_players FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_room_host(room_id, auth.uid()));
CREATE POLICY "rp_delete_self_or_host" ON public.room_players FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_room_host(room_id, auth.uid()));

-- ============ GAME ROUND POLICIES ============
CREATE POLICY "rounds_read_members" ON public.game_rounds FOR SELECT TO authenticated
  USING (public.is_room_member(room_id, auth.uid()) OR public.is_room_host(room_id, auth.uid()));
CREATE POLICY "rounds_write_host" ON public.game_rounds FOR ALL TO authenticated
  USING (public.is_room_host(room_id, auth.uid()))
  WITH CHECK (public.is_room_host(room_id, auth.uid()));

-- ============ ANSWER POLICIES ============
CREATE POLICY "answers_read_members" ON public.round_answers FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.game_rounds gr
      WHERE gr.id = round_id AND public.is_room_member(gr.room_id, auth.uid())
    )
  );
CREATE POLICY "answers_insert_self" ON public.round_answers FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind notif_kind NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX notif_user_idx ON public.notifications(user_id, created_at DESC);
CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "notif_delete_own" ON public.notifications FOR DELETE TO authenticated
  USING (user_id = auth.uid());
-- Inserts happen via security-definer functions or admin announcements broadcast

-- ============ ANNOUNCEMENTS ============
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ann_read_all" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "ann_admin_write" ON public.announcements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- When an announcement is created, fan it out to every user as a notification
CREATE OR REPLACE FUNCTION public.broadcast_announcement()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, kind, title, body)
  SELECT id, 'announcement', NEW.title, NEW.body FROM public.profiles;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.broadcast_announcement() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER announcement_broadcast
  AFTER INSERT ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.broadcast_announcement();

-- ============ ROOM CODE GENERATOR ============
CREATE OR REPLACE FUNCTION public.gen_room_code()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT;
  i INT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.rooms WHERE code = result) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.gen_room_code() TO authenticated;

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rounds;
ALTER PUBLICATION supabase_realtime ADD TABLE public.round_answers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_players REPLICA IDENTITY FULL;
ALTER TABLE public.game_rounds REPLICA IDENTITY FULL;
ALTER TABLE public.round_answers REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

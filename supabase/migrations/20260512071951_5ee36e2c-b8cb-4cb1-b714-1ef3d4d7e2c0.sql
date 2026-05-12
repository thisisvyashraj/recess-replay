
-- Content banks
CREATE TABLE public.spell_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  audio_url TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.spell_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY sw_read ON public.spell_words FOR SELECT TO authenticated USING (true);
CREATE POLICY sw_admin ON public.spell_words FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.lyric_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist TEXT NOT NULL,
  line TEXT NOT NULL,
  choices JSONB NOT NULL,
  correct INT NOT NULL,
  audio_url TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lyric_clips ENABLE ROW LEVEL SECURITY;
CREATE POLICY lc_read ON public.lyric_clips FOR SELECT TO authenticated USING (true);
CREATE POLICY lc_admin ON public.lyric_clips FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.mlt_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mlt_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY mlt_read ON public.mlt_prompts FOR SELECT TO authenticated USING (true);
CREATE POLICY mlt_admin ON public.mlt_prompts FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.type_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.type_sentences ENABLE ROW LEVEL SECURITY;
CREATE POLICY ts_read ON public.type_sentences FOR SELECT TO authenticated USING (true);
CREATE POLICY ts_admin ON public.type_sentences FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Room enhancements
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS games TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS current_game_index INT NOT NULL DEFAULT 0;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS final_leaderboard JSONB;

-- Storage for lyric audio
INSERT INTO storage.buckets (id, name, public) VALUES ('game-audio','game-audio',true)
  ON CONFLICT (id) DO NOTHING;
CREATE POLICY ga_read ON storage.objects FOR SELECT USING (bucket_id='game-audio');
CREATE POLICY ga_admin_write ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='game-audio' AND has_role(auth.uid(),'admin'));
CREATE POLICY ga_admin_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='game-audio' AND has_role(auth.uid(),'admin'));
CREATE POLICY ga_admin_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id='game-audio' AND has_role(auth.uid(),'admin'));

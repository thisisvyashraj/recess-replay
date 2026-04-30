
-- Fix security definer view -> use security_invoker
DROP VIEW IF EXISTS public.confessions_public;
CREATE VIEW public.confessions_public WITH (security_invoker = true) AS
  SELECT id, body, created_at FROM public.confessions ORDER BY created_at DESC;
GRANT SELECT ON public.confessions_public TO authenticated, anon;

-- handle_new_user is a trigger - revoke from API roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- Set search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

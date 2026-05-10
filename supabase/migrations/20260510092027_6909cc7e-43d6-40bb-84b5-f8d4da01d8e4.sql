
DROP VIEW IF EXISTS public.confessions_public;

CREATE OR REPLACE FUNCTION public.list_confessions()
RETURNS TABLE (id uuid, body text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.body, c.created_at
  FROM public.confessions c
  ORDER BY c.created_at DESC
  LIMIT 200;
$$;

REVOKE ALL ON FUNCTION public.list_confessions() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_confessions() TO authenticated;

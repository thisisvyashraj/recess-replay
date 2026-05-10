
DROP POLICY IF EXISTS confessions_read_auth ON public.confessions;

-- Recreate the view as SECURITY DEFINER so it bypasses base-table RLS
-- (we explicitly only expose id/body/created_at — user_id is never selected).
DROP VIEW IF EXISTS public.confessions_public;
CREATE VIEW public.confessions_public
WITH (security_invoker = off) AS
SELECT id, body, created_at FROM public.confessions;

ALTER VIEW public.confessions_public OWNER TO postgres;
GRANT SELECT ON public.confessions_public TO authenticated, anon;

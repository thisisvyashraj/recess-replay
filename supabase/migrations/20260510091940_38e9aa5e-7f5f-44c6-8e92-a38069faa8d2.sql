
-- Public anonymized view of confessions (no user_id leaked)
CREATE OR REPLACE VIEW public.confessions_public
WITH (security_invoker = on) AS
SELECT id, body, created_at FROM public.confessions;

GRANT SELECT ON public.confessions_public TO authenticated;

-- Allow members to read confessions through the view: add a generic
-- read policy on the base table that excludes user_id at the view level.
DROP POLICY IF EXISTS confessions_read_auth ON public.confessions;
CREATE POLICY confessions_read_auth ON public.confessions
  FOR SELECT TO authenticated
  USING (true);

-- Allow admins to insert notifications for any user (for targeted DMs / announcements)
DROP POLICY IF EXISTS notif_admin_insert ON public.notifications;
CREATE POLICY notif_admin_insert ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow public inserts" ON public.inquiries;
CREATE POLICY "Allow public inserts" ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (consent = true AND team_slug = 'TeamMaga' AND source = 'ai-web-2026');


CREATE POLICY "Dataset files read authed" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'datasets');
CREATE POLICY "Dataset files upload authed" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'datasets');
CREATE POLICY "Dataset files owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'datasets' AND owner = auth.uid());
CREATE POLICY "Dataset files owner or admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'datasets' AND (owner = auth.uid() OR public.has_role(auth.uid(),'admin')));

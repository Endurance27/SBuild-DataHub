
CREATE TABLE public.notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text,
  content text,
  language text NOT NULL DEFAULT 'python',
  dataset_id uuid REFERENCES public.datasets(id) ON DELETE SET NULL,
  views integer NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notebooks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notebooks TO authenticated;
GRANT ALL ON public.notebooks TO service_role;
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notebooks public read" ON public.notebooks FOR SELECT
  USING ((published AND NOT hidden) OR auth.uid() = author_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Notebooks insert own" ON public.notebooks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Notebooks update own or admin" ON public.notebooks FOR UPDATE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = author_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Notebooks delete own or admin" ON public.notebooks FOR DELETE TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_notebooks_updated BEFORE UPDATE ON public.notebooks
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.notebook_likes (
  notebook_id uuid NOT NULL REFERENCES public.notebooks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (notebook_id, user_id)
);
GRANT SELECT ON public.notebook_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.notebook_likes TO authenticated;
GRANT ALL ON public.notebook_likes TO service_role;
ALTER TABLE public.notebook_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes public read" ON public.notebook_likes FOR SELECT USING (true);
CREATE POLICY "Likes insert own" ON public.notebook_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Likes delete own" ON public.notebook_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE public.role_permissions (
  role app_role NOT NULL,
  permission text NOT NULL,
  allowed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role, permission)
);
GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perms readable by authed" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Perms manage admin" ON public.role_permissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.role_permissions (role, permission, allowed) VALUES
  ('admin','read',true),('admin','write',true),('admin','delete',true),('admin','download',true),
  ('moderator','read',true),('moderator','write',true),('moderator','delete',false),('moderator','download',true),
  ('user','read',true),('user','write',false),('user','delete',false),('user','download',true);

CREATE TABLE public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.platform_settings TO anon, authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public read" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Settings admin write" ON public.platform_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.platform_settings(key,value) VALUES
  ('site_name','"GH DataHub"'::jsonb),
  ('allow_signups','true'::jsonb),
  ('maintenance_mode','false'::jsonb);

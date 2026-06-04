
-- SITE CONTENT (CMS)
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_content public read" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "site_content admin write" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tr_site_content_updated BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ORGANIZATIONS
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  logo_url text,
  website text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.organizations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orgs public read" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "orgs admin write" ON public.organizations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tr_orgs_updated BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cats public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "cats admin write" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tr_cats_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- TAGS
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags public read" ON public.tags FOR SELECT USING (true);
CREATE POLICY "tags admin write" ON public.tags FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- DATASETS
CREATE TYPE public.dataset_status AS ENUM ('pending','under_review','approved','published','rejected','archived');

CREATE TABLE public.datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  status public.dataset_status NOT NULL DEFAULT 'pending',
  featured boolean NOT NULL DEFAULT false,
  downloads int NOT NULL DEFAULT 0,
  file_size_mb numeric,
  file_url text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  uploader_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_notes text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.datasets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.datasets TO authenticated;
GRANT ALL ON public.datasets TO service_role;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "datasets public read published" ON public.datasets FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(),'admin') OR auth.uid() = uploader_id);
CREATE POLICY "datasets insert own" ON public.datasets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "datasets update own or admin" ON public.datasets FOR UPDATE TO authenticated
  USING (auth.uid() = uploader_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = uploader_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "datasets delete admin" ON public.datasets FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tr_datasets_updated BEFORE UPDATE ON public.datasets
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- DATASET_TAGS
CREATE TABLE public.dataset_tags (
  dataset_id uuid NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (dataset_id, tag_id)
);
GRANT SELECT ON public.dataset_tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dataset_tags TO authenticated;
GRANT ALL ON public.dataset_tags TO service_role;
ALTER TABLE public.dataset_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dataset_tags public read" ON public.dataset_tags FOR SELECT USING (true);
CREATE POLICY "dataset_tags admin write" ON public.dataset_tags FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- REPORTS
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  target_type text NOT NULL,
  target_id uuid,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open',
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports admin read" ON public.reports FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR auth.uid() = reporter_id);
CREATE POLICY "reports user insert" ON public.reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports admin update" ON public.reports FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tr_reports_updated BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- SEED default CMS content
INSERT INTO public.site_content (key, value) VALUES
  ('homepage_hero', '{"title":"Open Data for a Smarter Ghana","subtitle":"Discover, share, and analyze datasets to drive innovation and research across Ghana","primary_cta":"Explore Datasets","primary_link":"/explore","secondary_cta":"Upload Dataset","secondary_link":"/upload"}'::jsonb),
  ('homepage_cta', '{"title":"Ready to Share Your Data?","subtitle":"Join Ghana''s growing community of researchers, developers, and data enthusiasts","primary_cta":"Explore Datasets","primary_link":"/explore","secondary_cta":"Learn More","secondary_link":"/about"}'::jsonb),
  ('site_banner', '{"enabled":false,"message":"","variant":"info"}'::jsonb),
  ('footer_brand', '{"name":"SBuild DataHub","tagline":"Open Data for a Smarter Ghana","email":"info@ghdatahub.com"}'::jsonb);

-- SEED a few categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Demographics','demographics',1),
  ('Economics','economics',2),
  ('Healthcare','healthcare',3),
  ('Education','education',4),
  ('Agriculture','agriculture',5),
  ('Environment','environment',6);

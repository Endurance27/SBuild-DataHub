
-- Discussions
CREATE TABLE public.discussion_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid,
  title text NOT NULL,
  body text,
  category text NOT NULL DEFAULT 'General',
  locked boolean NOT NULL DEFAULT false,
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Threads viewable by everyone" ON public.discussion_threads FOR SELECT USING (true);
CREATE POLICY "Users create own threads" ON public.discussion_threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own threads" ON public.discussion_threads FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admins manage threads" ON public.discussion_threads FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_threads_updated BEFORE UPDATE ON public.discussion_threads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.discussion_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  author_id uuid,
  body text NOT NULL,
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Replies viewable by everyone" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "Users create own replies" ON public.discussion_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admins manage replies" ON public.discussion_replies FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Competitions
CREATE TYPE public.competition_status AS ENUM ('draft','active','closed');
CREATE TABLE public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid,
  title text NOT NULL,
  description text,
  prize text,
  deadline timestamptz,
  status public.competition_status NOT NULL DEFAULT 'draft',
  winner_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active competitions viewable" ON public.competitions FOR SELECT USING (status <> 'draft' OR auth.uid() = host_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Users create competitions" ON public.competitions FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts update own competitions" ON public.competitions FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Admins manage competitions" ON public.competitions FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_comp_updated BEFORE UPDATE ON public.competitions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.competition_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  score numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.competition_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Submissions viewable by everyone" ON public.competition_submissions FOR SELECT USING (true);
CREATE POLICY "Users create own submissions" ON public.competition_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage submissions" ON public.competition_submissions FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Gamification
CREATE TABLE public.user_xp (
  user_id uuid PRIMARY KEY,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  rank text NOT NULL DEFAULT 'Novice',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "XP viewable by everyone" ON public.user_xp FOR SELECT USING (true);
CREATE POLICY "Admins manage XP" ON public.user_xp FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_xp_updated BEFORE UPDATE ON public.user_xp FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges viewable by everyone" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Admins manage badges" ON public.badges FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Admins award badges" ON public.user_badges FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Seed a few badges
INSERT INTO public.badges (name, description, icon) VALUES
  ('First Upload','Uploaded first dataset','upload'),
  ('Top Contributor','Reached the leaderboard top 10','trophy'),
  ('Community Helper','Active in discussions','message-square')
ON CONFLICT (name) DO NOTHING;

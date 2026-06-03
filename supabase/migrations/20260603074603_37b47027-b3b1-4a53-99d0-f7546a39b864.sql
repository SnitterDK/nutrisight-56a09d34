
-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-grant admin role to the founder email
CREATE OR REPLACE FUNCTION public.grant_admin_if_founder()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'kasper.mathiesen@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER grant_admin_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_if_founder();

-- Backfill admin if user already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
WHERE email = 'kasper.mathiesen@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. beta_signups
CREATE TYPE public.beta_status AS ENUM ('new', 'contacted', 'tester', 'partner', 'archived');

CREATE TABLE public.beta_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  selected_goal TEXT,
  message TEXT,
  source_page TEXT,
  consent_contact BOOLEAN NOT NULL DEFAULT false,
  consent_testimonial BOOLEAN NOT NULL DEFAULT false,
  status public.beta_status NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.beta_signups TO anon, authenticated;
GRANT SELECT, UPDATE ON public.beta_signups TO authenticated;
GRANT ALL ON public.beta_signups TO service_role;

ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit beta signups"
  ON public.beta_signups FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read beta signups"
  ON public.beta_signups FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update beta signups"
  ON public.beta_signups FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_text TEXT NOT NULL,
  feature_area TEXT,
  testimonial_permission BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.feedback TO anon, authenticated;
GRANT SELECT ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read feedback"
  ON public.feedback FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. gemini_logs
CREATE TABLE public.gemini_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  input_type TEXT,
  prompt_summary TEXT,
  response_summary TEXT,
  model_used TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  latency_ms INTEGER,
  token_usage JSONB,
  safety_flags JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.gemini_logs TO anon, authenticated;
GRANT SELECT ON public.gemini_logs TO authenticated;
GRANT ALL ON public.gemini_logs TO service_role;

ALTER TABLE public.gemini_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can write gemini logs"
  ON public.gemini_logs FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read gemini logs"
  ON public.gemini_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. scan_events
CREATE TABLE public.scan_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  input_type TEXT,
  selected_goal TEXT,
  detected_food_items JSONB,
  estimated_calories NUMERIC,
  estimated_sugar NUMERIC,
  estimated_carbs NUMERIC,
  estimated_protein NUMERIC,
  estimated_fiber NUMERIC,
  estimated_salt TEXT,
  recommendation TEXT,
  confidence NUMERIC,
  used_gemini BOOLEAN NOT NULL DEFAULT true,
  safety_disclaimer_shown BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.scan_events TO anon, authenticated;
GRANT SELECT ON public.scan_events TO authenticated;
GRANT ALL ON public.scan_events TO service_role;

ALTER TABLE public.scan_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log scan events"
  ON public.scan_events FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read scan events"
  ON public.scan_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_scan_events_created ON public.scan_events (created_at DESC);
CREATE INDEX idx_gemini_logs_created ON public.gemini_logs (created_at DESC);
CREATE INDEX idx_beta_signups_created ON public.beta_signups (created_at DESC);
CREATE INDEX idx_feedback_created ON public.feedback (created_at DESC);

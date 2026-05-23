
-- Profiles table: one per auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  primary_goal TEXT NOT NULL DEFAULT 'overall',
  daily_calorie_target INT NOT NULL DEFAULT 2000,
  daily_sugar_target_g INT NOT NULL DEFAULT 50,
  daily_protein_target_g INT NOT NULL DEFAULT 90,
  daily_fiber_target_g INT NOT NULL DEFAULT 30,
  xp INT NOT NULL DEFAULT 0,
  streak_days INT NOT NULL DEFAULT 0,
  last_active_date DATE,
  onboarded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles are insertable by owner"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles are updatable by owner"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Meals table: scan history
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  calories_kcal NUMERIC NOT NULL DEFAULT 0,
  sugar_g NUMERIC NOT NULL DEFAULT 0,
  carbs_g NUMERIC NOT NULL DEFAULT 0,
  protein_g NUMERIC NOT NULL DEFAULT 0,
  fiber_g NUMERIC NOT NULL DEFAULT 0,
  salt_level TEXT,
  health_score INT,
  recommendation TEXT,
  goal TEXT,
  image_url TEXT,
  scan_payload JSONB,
  eaten_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX meals_user_eaten_idx ON public.meals(user_id, eaten_at DESC);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Meals are viewable by owner"
  ON public.meals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Meals are insertable by owner"
  ON public.meals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Meals are updatable by owner"
  ON public.meals FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Meals are deletable by owner"
  ON public.meals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Learning progress: which lessons the user has completed (for XP / gamification)
CREATE TABLE public.learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_key TEXT NOT NULL,
  xp_earned INT NOT NULL DEFAULT 10,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_key)
);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learning progress viewable by owner"
  ON public.learning_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Learning progress insertable by owner"
  ON public.learning_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

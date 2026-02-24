-- BeyondCampus Database Setup
-- Copy and paste this entire script into your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/urodkcasszwmstovmtis/sql/new

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  nickname TEXT,
  current_education TEXT,
  target_countries TEXT[],
  study_timeline TEXT,
  preferred_course TEXT,
  budget TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI Twins table
CREATE TABLE IF NOT EXISTS public.twins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  twin_name TEXT NOT NULL,
  tagline TEXT,
  personality TEXT,
  tone TEXT,
  links JSONB DEFAULT '[]',
  status TEXT DEFAULT 'TRAINING' CHECK (status IN ('TRAINING', 'PUBLISHED')),
  public_url TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 3. Twin Sessions table (track interactions + topics/chapters)
CREATE TABLE IF NOT EXISTS public.twin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twin_id UUID NOT NULL REFERENCES public.twins(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('trainer', 'chat')),
  notebook_id TEXT, -- Maps to LangGraph notebook concept
  chapter_id TEXT,  -- Maps to LangGraph chapter concept  
  thread_id TEXT,   -- LangGraph thread ID
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ERROR')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_twins_user_id ON public.twins(user_id);
CREATE INDEX IF NOT EXISTS idx_twins_status ON public.twins(status);
CREATE INDEX IF NOT EXISTS idx_twins_public_url ON public.twins(public_url);
CREATE INDEX IF NOT EXISTS idx_sessions_twin_id ON public.twin_sessions(twin_id);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON public.twin_sessions(type);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.twin_sessions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for twins table
DROP POLICY IF EXISTS "Users can manage own twins" ON public.twins;
CREATE POLICY "Users can manage own twins" ON public.twins
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view published twins" ON public.twins;
CREATE POLICY "Anyone can view published twins" ON public.twins
  FOR SELECT USING (status = 'PUBLISHED');

-- RLS Policies for twin_sessions table
DROP POLICY IF EXISTS "Users can view own twin sessions" ON public.twin_sessions;
CREATE POLICY "Users can view own twin sessions" ON public.twin_sessions
  FOR SELECT USING (
    twin_id IN (SELECT id FROM public.twins WHERE user_id = auth.uid())
    OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can manage own twin sessions" ON public.twin_sessions;
CREATE POLICY "Users can manage own twin sessions" ON public.twin_sessions
  FOR ALL USING (
    twin_id IN (SELECT id FROM public.twins WHERE user_id = auth.uid())
    OR user_id = auth.uid()
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert function to handle user creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
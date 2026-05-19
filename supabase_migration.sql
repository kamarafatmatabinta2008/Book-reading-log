-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Books Table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  page_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  engagement_score FLOAT DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  active_sessions INTEGER DEFAULT 0
);

-- 3. User Library Table
CREATE TABLE user_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  current_page INTEGER DEFAULT 0,
  reading_status TEXT CHECK (reading_status IN ('Reading', 'Finished', 'Dropped')) DEFAULT 'Reading',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- 4. Feedback Table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Books: Anyone can read books (publicly readable)
CREATE POLICY "Books are publicly readable" ON books FOR SELECT USING (true);

-- User Library: Users can only CRUD their own library entries
CREATE POLICY "Users can manage own library" ON user_library FOR ALL USING (auth.uid() = user_id);

-- Feedback: Public can read feedback, only owners can CRUD
CREATE POLICY "Feedback is publicly readable" ON feedback FOR SELECT USING (true);
CREATE POLICY "Users can manage own feedback" ON feedback FOR ALL USING (auth.uid() = user_id);

-- Trending Logic (Engagement Score calculation)
-- Note: This is usually handled via an RPC or a View
CREATE OR REPLACE FUNCTION calculate_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE books
  SET engagement_score = unique_clicks + (active_sessions * 2.5)
  WHERE id = NEW.book_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for engagement updates (simplified)
-- In a real scenario, you'd trigger this on library updates or click increments

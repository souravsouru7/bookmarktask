-- Create the bookmarks table (if not exists)
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  user_id uuid DEFAULT auth.uid() NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create Policy for SELECT (Users can view only their own bookmarks)
CREATE POLICY "Users can view own bookmarks"
ON bookmarks FOR SELECT
USING ( auth.uid() = user_id );

-- Create Policy for INSERT (Users can insert only with their own user_id)
CREATE POLICY "Users can insert own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK ( auth.uid() = user_id );

-- Create Policy for DELETE (Users can delete only their own bookmarks)
CREATE POLICY "Users can delete own bookmarks"
ON bookmarks FOR DELETE
USING ( auth.uid() = user_id );

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

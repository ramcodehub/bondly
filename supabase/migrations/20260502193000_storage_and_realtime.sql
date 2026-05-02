-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage.objects

-- 1. Allow public access to view avatars
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 2. Allow authenticated users to manage their own avatar
-- This covers INSERT, UPDATE, DELETE by checking if the path starts with user_id
CREATE POLICY "Users can manage their own avatar."
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'avatars' AND 
    (
        name = auth.uid()::text OR 
        name LIKE auth.uid()::text || '.%' OR
        (storage.foldername(name))[1] = auth.uid()::text
    )
)
WITH CHECK (
    bucket_id = 'avatars' AND 
    (
        name = auth.uid()::text OR 
        name LIKE auth.uid()::text || '.%' OR
        (storage.foldername(name))[1] = auth.uid()::text
    )
);

-- Enable Realtime for profiles table
ALTER TABLE profiles REPLICA IDENTITY FULL;

-- Add profiles to the realtime publication
-- Check if the publication exists first, or just try to add the table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
    END IF;
END $$;

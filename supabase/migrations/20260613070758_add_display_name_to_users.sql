-- Add display_name to users table
ALTER TABLE public.users ADD COLUMN display_name TEXT;

-- Update existing users
UPDATE public.users 
SET display_name = 'EcoUser_' || substr(id::text, 1, 6) 
WHERE display_name IS NULL;

-- Make it NOT NULL
ALTER TABLE public.users ALTER COLUMN display_name SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN display_name SET DEFAULT 'EcoUser';

-- Update handle_new_user trigger to populate display_name
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, display_name, created_at)
    VALUES (
        NEW.id, 
        NEW.email, 
        'EcoUser_' || substr(NEW.id::text, 1, 6),
        NEW.created_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

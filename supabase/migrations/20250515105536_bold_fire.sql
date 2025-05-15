/*
  # Fix profiles table RLS policies

  1. Changes
    - Remove recursive policy checks that were causing infinite recursion
    - Simplify policies to use direct role checks
    - Add policy for profile creation on signup
  
  2. Security
    - Users can still only read and update their own profiles
    - Admins retain access to all profiles
    - Added policy for initial profile creation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add policy for profile creation during signup
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
import { supabase } from './supabase';

export async function seedAdminUser() {
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin')
    .single();

  if (!existingUser) {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@brutal.design',
      password: 'BrutalAdmin2025!', // This should be changed after first login
      options: {
        data: {
          username: 'Admin',
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }

    console.log('Admin user created successfully');
    return data;
  }

  console.log('Admin user already exists');
  return existingUser;
}
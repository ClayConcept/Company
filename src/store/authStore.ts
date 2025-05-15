import { create } from 'zustand';
import { User, SubscriptionTier, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateSubscription: (tier: SubscriptionTier) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  
  login: async (email: string, password: string, role: UserRole = 'user') => {
    set({ isLoading: true });
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) {
        throw new Error('Failed to fetch profile: ' + profileError.message);
      }
      
      if (!profile) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              username: email.split('@')[0], // Temporary username
              role: 'user',
              subscription: 'free'
            }
          ])
          .select()
          .single();
          
        if (createError) throw new Error('Failed to create profile: ' + createError.message);
        
        set({ 
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            username: newProfile.username,
            subscription: newProfile.subscription as SubscriptionTier,
            role: newProfile.role as UserRole,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ 
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            username: profile.username,
            subscription: profile.subscription as SubscriptionTier,
            role: profile.role as UserRole,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role: 'user',
          },
        },
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('User not created');
      
      // Create initial profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            username,
            role: 'user',
            subscription: 'free'
          }
        ]);
        
      if (profileError) throw new Error('Failed to create profile: ' + profileError.message);
      
      set({ 
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          username,
          subscription: 'free',
          role: 'user',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateSubscription: async (tier: SubscriptionTier) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription: tier })
        .eq('id', supabase.auth.getUser());
      
      if (error) throw error;
      
      set(state => ({
        user: state.user ? { ...state.user, subscription: tier } : null
      }));
    } catch (error) {
      throw error;
    }
  },
}));

// Initialize auth state from session
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data: profile, error }) => {
        if (error) {
          console.error('Failed to fetch profile:', error);
          return;
        }
        if (profile) {
          useAuthStore.setState({
            user: {
              id: session.user.id,
              email: session.user.email!,
              username: profile.username,
              subscription: profile.subscription as SubscriptionTier,
              role: profile.role as UserRole,
            },
            isAuthenticated: true,
          });
        }
      });
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  }
});

export default useAuthStore;
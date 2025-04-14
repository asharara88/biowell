import { create } from 'zustand';
import { supabase } from '../api/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  initialized: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  signIn: async () => {
    try {
      set({ loading: true, error: null });
      // Demo user for testing
      const demoUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'demo@biowell.ai',
        role: 'authenticated',
      } as User;
      
      set({ user: demoUser, initialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to sign in' });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to sign out' });
    } finally {
      set({ loading: false });
    }
  },
}));
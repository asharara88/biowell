import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'biowell',
      'x-client-info': 'supabase-js/2.39.7'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add request interceptor for better error handling
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    const response = await originalFetch(input, init);
    
    if (!response.ok) {
      // Log error details for debugging
      console.error('Request failed:', {
        url: typeof input === 'string' ? input : input.url,
        status: response.status,
        statusText: response.statusText
      });

      // Try to get error details from response
      const errorData = await response.clone().json().catch(() => ({}));
      console.error('Error details:', errorData);
    }
    
    return response;
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isBackendConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const supabase = isBackendConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    })
  : null;

export function requireBackend() {
  if (!supabase) throw new Error('Backend não configurado. Preencha EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.');
  return supabase;
}

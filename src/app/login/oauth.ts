"use server";

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Provider } from '@supabase/supabase-js';

export async function signInWithOAuth(provider: Provider) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `http://localhost:3000/auth/callback`,
    },
  });

  if (error) {
    console.error(`OAuth error (${provider}):`, error.message);
    // Ideally redirect back to login with error params
    redirect('/login?error=OAuth_Failed');
  }

  if (data.url) {
    redirect(data.url);
  }
}

import { createBrowserClient } from '@supabase/ssr'

// Note: Phone/SMS auth requires an SMS provider (Twilio, MessageBird, or Vonage) 
// to be connected in the Supabase project dashboard under Authentication > Providers > Phone.
// This cannot be configured from code.

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error(
      "CRITICAL ERROR: Supabase environment variables are missing! " +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel project settings."
    );
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

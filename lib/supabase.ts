import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("INDUSTRIAL ALERT: Supabase keys are missing in Environment Variables.");
}

// This is the single source of truth for your database connection
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
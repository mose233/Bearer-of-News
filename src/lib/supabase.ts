import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bjclqqynzsljskfeqfdj.supabase.co';
const supabaseKey = 'sb_publishable_lrdCN_8hOVwRFf3ncP5Tzg_aa0ATnnX';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

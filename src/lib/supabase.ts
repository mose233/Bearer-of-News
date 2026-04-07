import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://bjclqqynzsljskfeqfdj.supabase.co';
const supabaseKey = 'sb_publishable_lrdCN_8hOVwRFf3ncP5Tzg_aa0ATnnX';

const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
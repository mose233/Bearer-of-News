import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://bjclqqynzsljskfeqfdj.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

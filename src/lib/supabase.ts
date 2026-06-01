import { createClient } from "@supabase/supabase-js";



const supabaseUrl =

  import.meta.env.VITE_SUPABASE_URL ||

  "https://bjclqqynzsljskfeqfdj.supabase.co";



const supabaseAnonKey =

  import.meta.env.VITE_SUPABASE_ANON_KEY ||

  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqY2xxcXluenNsanNrZmVxZmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDM0OTgsImV4cCI6MjA4NjcxOTQ5OH0.eB5iol81f6Yrw3kLJnDnihcCevhDHvpAJMPT-uuBINc"; 



export const supabase = createClient(supabaseUrl, supabaseAnonKey);

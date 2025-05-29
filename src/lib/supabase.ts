import { createClient } from "@supabase/supabase-js";

// Pastikan nilai-nilai ini tidak kosong saat debugging
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;


// Existing supabase client
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || "",
  process.env.REACT_APP_SUPABASE_ANON_KEY || ""
);

// Second supabase client for tutorials
export const supabaseSecondary = createClient(
  process.env.REACT_APP_SUPABASE_URL_2 || "",
  process.env.REACT_APP_SUPABASE_ANON_KEY_2 || ""
);


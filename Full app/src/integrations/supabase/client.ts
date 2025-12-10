import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nzdoxyzmfatirqkwaqho.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZG94eXptZmF0aXJxa3dhcWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODYyODksImV4cCI6MjA3ODk2MjI4OX0.gvX4EGjz6p-Rd17WSauj1fFyvlXuBrZ9A5DhBZgYG_Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";

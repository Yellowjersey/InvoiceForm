import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqdpatjugbkiwgugfjzy.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZHBhdGp1Z2JraXdndWdmanp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0MTIwNTAsImV4cCI6MjAxNzk4ODA1MH0.yRVHYrKZYGJxdUfBMIIpwb16Qs4oNFI_tFaywGhbBHw';
export const supabase = createClient(supabaseUrl, supabaseKey);

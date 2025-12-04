import { createClient } from "@supabase/supabase-js";

const supabase_url = "https://hktveflatvzickxruzqj.supabase.co";
const supabase_api = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdHZlZmxhdHZ6aWNreHJ1enFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNDI5OTEsImV4cCI6MjA3NTgxODk5MX0.ZGVJ0jHsCBC49D98H6b9Jtl2z4vHTOYwuOc7fb638aM";

export const supabase = createClient(supabase_url, supabase_api);

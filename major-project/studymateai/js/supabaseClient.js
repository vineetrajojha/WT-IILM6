import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://jkozezgxlmxlcnxbpnxd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb3plemd4bG14bGNueGJwbnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NjE4NjksImV4cCI6MjA4NzIzNzg2OX0.4TAk04cL79LsfAwEHVClTfNdZvbeshKaXoWIXwZFj98'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

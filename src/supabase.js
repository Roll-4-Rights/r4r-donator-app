import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mjdgtdxmbzjimzswywvl.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_PUBLIC_KEY'  // Get from Supabase Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ❌ OLD (insecure - token visible)
fetch('http://localhost:8080/api/v1/db/data/...', {
  headers: { 'xc-auth': 'visible-token' }  // BAD!
})

// ✅ NEW (secure - no tokens in frontend)
import { supabase } from '@/supabase'

const { data, error } = await supabase
  .from('donation_items')
  .select('*')
  .eq('user_id', currentUserId)
// Row-Level Security automatically filters to only user's data!
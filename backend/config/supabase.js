const { createClient } = require('@supabase/supabase-js');
<<<<<<< HEAD

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_KEY is missing from .env. Database features will be disabled.');
}

// Service role key bypasses Row Level Security — safe for server-side only
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

=======
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase URL or Key is missing. Supabase integration will be disabled.');
}

>>>>>>> rahul/frontend
module.exports = supabase;

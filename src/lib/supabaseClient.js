
import { createClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder';

let url = import.meta.env.VITE_SUPABASE_URL;
let key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verify if keys are valid (not placeholders)
if (!url || url.includes('YOUR_SUPABASE_URL')) {
    console.warn('Supabase URL is missing or invalid. Using fallback.');
    url = fallbackUrl;
}
if (!key || key.includes('YOUR_SUPABASE_ANON_KEY')) {
    key = fallbackKey;
}

export const supabase = createClient(url, key);

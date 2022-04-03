import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://pxwlafrbvcetzwukdouy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTkwODY1MSwiZXhwIjoxOTU1NDg0NjUxfQ.k8iTru6so8febdNeYnzqP4Yf4RpUp8wFNvHTisf-wV8'
)
export default (_, inject) => {
  // Inject $supabase() in Vue, context and store.
  inject('supabase', supabase)
}

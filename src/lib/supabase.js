import { createClient } from '@supabase/supabase-js'

// ═══ PEGAR TUS CREDENCIALES AQUÍ ═══
// Ve a tu notepad y copia los valores del Paso A3

const SUPABASE_URL = 'https://nhyedrvkxhyyoqxgcmrg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_J5bnTFDBgoLu19XPKuZisQ_Q-Qj-kkM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
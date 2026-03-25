import { createClient } from '@supabase/supabase-js'

// ═══ PEGAR TUS CREDENCIALES AQUÍ ═══
// Ve a tu notepad y copia los valores del Paso A3

const SUPABASE_URL = 'https://nhyedrvkxhyyoqxgcmrg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oeWVkcnZreGh5eW9xeGdjbXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODU2NDgsImV4cCI6MjA4OTk2MTY0OH0.rA5fkCJHUdQtehSs0iAAiPI2J-D8TLNd-8MOw6K2a-4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
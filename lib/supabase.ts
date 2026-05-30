import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase para el lado del cliente (navegador)
 * 
 * Las variables NEXT_PUBLIC_* son públicas y seguras para exponerlas en el navegador.
 * La seguridad se maneja a través de:
 * - Row Level Security (RLS) en la base de datos
 * - Autenticación con Clerk
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables de entorno de Supabase no están configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

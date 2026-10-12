import { createClient } from "@supabase/supabase-js";

// Credenciales leídas desde variables de entorno (.env). Nunca hardcodear.
const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabaseKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en el archivo .env");
}

// Cliente único de solo lectura pública (sin sesión persistida → seguro en SSR).
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Cliente do Supabase usado apenas no servidor, com a chave de serviço.
 * O app não tem login: o acesso é controlado por tokens secretos nos links,
 * e todas as consultas passam pelo servidor. Por isso o banco tem RLS ligado
 * sem políticas públicas (a chave anônima não lê nada).
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (veja .env.example).");
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

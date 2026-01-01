import dotenv from "dotenv";
dotenv.config(); // garante que as variáveis do .env estão disponíveis aqui

import { createClient } from "@supabase/supabase-js";

console.log("supabaseUrl no supabase.js:", process.env.SUPABASE_URL);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default supabase;

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
	db: {
		schema: import.meta.env.VITE_SUPABASE_SCHEMA,
	},
});

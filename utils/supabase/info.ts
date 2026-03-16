const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const projectId = supabaseUrl
  .replace("https://", "")
  .replace(".supabase.co", "");

export { projectId, publicAnonKey };

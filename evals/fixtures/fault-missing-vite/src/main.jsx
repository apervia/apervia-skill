import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
const menu = await fetch(import.meta.env.VITE_MENU_API_URL + "/today").then((r) => r.json());
document.getElementById("root").textContent = "Today: " + menu.dish;

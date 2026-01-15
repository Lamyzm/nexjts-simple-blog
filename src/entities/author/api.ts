import { createClient } from "@/lib/supabase/client";

import type { Author } from "./model";

export async function getAuthors(): Promise<Author[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAuthorById(id: string): Promise<Author | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

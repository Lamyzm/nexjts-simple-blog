import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

import type { Database } from "./types";

/**
 * 서버 사이드 Supabase 클라이언트
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSSRClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, options, value }) => {
              cookieStore.set(name, value, {
                ...options,
                maxAge: 60 * 60 * 24 * 60, // 60일
              });
            });
          } catch (error) {
            // Cookies can't be set in Server Components
          }
        },
      },
    }
  );
}

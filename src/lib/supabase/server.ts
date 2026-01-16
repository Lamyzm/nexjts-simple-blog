import { createClient } from "@supabase/supabase-js";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

import type { Database } from "./types";

/**
 * 서버 사이드 Supabase 클라이언트 (인증 필요 시)
 * cookies()를 사용하므로 동적 렌더링 강제
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
          } catch {
            // Cookies can't be set in Server Components
          }
        },
      },
    }
  );
}

/**
 * 정적 Supabase 클라이언트 (공개 데이터용)
 * cookies()를 사용하지 않아 ISR 가능
 */
export function createStaticClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

import type { SupabaseClient } from "@supabase/supabase-js";

import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

import type { Database } from "./types";

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * 브라우저용 Supabase 클라이언트 생성
 */
export function createClient(): TypedSupabaseClient {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// 싱글톤 인스턴스
let browserClient: TypedSupabaseClient | null = null;

function getSupabaseBrowserClient(): TypedSupabaseClient {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}

/**
 * 기존 코드 호환성을 위한 싱글톤 인스턴스
 * 클라이언트 컴포넌트에서만 사용 가능
 */
export const supabase: TypedSupabaseClient =
  typeof window !== "undefined"
    ? getSupabaseBrowserClient()
    : (createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
      ) as TypedSupabaseClient);

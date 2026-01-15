import { z } from "zod";

/**
 * 환경 변수 검증 스키마
 */

// 클라이언트 환경 변수 (NEXT_PUBLIC_* - 브라우저에서 접근 가능)
const clientSchema = z.object({
  NEXT_PUBLIC_CLARITY_ID: z.string().optional().default(""),
  NEXT_PUBLIC_GA_ID: z.string().optional().default(""),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
});

// 서버 환경 변수 (서버에서만 접근 가능)
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

/**
 * 환경 변수 검증 함수
 */
function validateEnv() {
  const clientEnv = clientSchema.safeParse({
    NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  if (!clientEnv.success) {
    console.error(
      "❌ Invalid client environment variables:",
      clientEnv.error.flatten().fieldErrors
    );
    throw new Error("Invalid client environment variables");
  }

  const isServer = typeof window === "undefined";
  if (isServer) {
    const serverEnv = serverSchema.safeParse({
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    });

    if (!serverEnv.success) {
      console.error(
        "❌ Invalid server environment variables:",
        serverEnv.error.flatten().fieldErrors
      );
      throw new Error("Invalid server environment variables");
    }

    return {
      client: clientEnv.data,
      server: serverEnv.data,
    };
  }

  return {
    client: clientEnv.data,
    server: {} as z.infer<typeof serverSchema>,
  };
}

const validatedEnv = validateEnv();

/**
 * 타입 안전한 환경 변수 접근
 */
export const env = new Proxy(
  {} as z.infer<typeof clientSchema> & z.infer<typeof serverSchema>,
  {
    get(_, prop: string) {
      if (prop.startsWith("NEXT_PUBLIC_")) {
        return validatedEnv.client[prop as keyof typeof validatedEnv.client];
      }

      const isServer = typeof window === "undefined";
      if (!isServer) {
        throw new Error(
          `❌ Attempted to access server-only environment variable "${prop}" on the client`
        );
      }

      return validatedEnv.server[prop as keyof typeof validatedEnv.server];
    },
  }
);

export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;
export type Env = ClientEnv & ServerEnv;

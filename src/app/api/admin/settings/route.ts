import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function PUT(request: NextRequest) {
  const { currentKey, newKey } = await request.json();

  if (!currentKey || !newKey) {
    return NextResponse.json(
      { message: "현재 키와 새 키를 입력해주세요", success: false },
      { status: 400 }
    );
  }

  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 현재 키 검증
  const { data: settings, error: fetchError } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "admin_key")
    .single();

  if (fetchError || !settings?.value) {
    return NextResponse.json(
      { message: "서버 설정 오류", success: false },
      { status: 500 }
    );
  }

  if (currentKey !== settings.value) {
    return NextResponse.json(
      { message: "현재 키가 올바르지 않습니다", success: false },
      { status: 401 }
    );
  }

  // 새 키로 업데이트
  const { error: updateError } = await supabase
    .from("site_settings")
    .update({ value: newKey, updated_at: new Date().toISOString() })
    .eq("key", "admin_key");

  if (updateError) {
    return NextResponse.json(
      { message: "키 변경 실패: " + updateError.message, success: false },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * 기존 이미지들에 blur hash 생성하는 스크립트
 *
 * 사전 준비:
 * 1. Supabase 대시보드 > SQL Editor에서 실행:
 *    ALTER TABLE post_images ADD COLUMN IF NOT EXISTS blur_data_url TEXT;
 *
 * 2. .env.local에 SUPABASE_SERVICE_ROLE_KEY 추가 (Supabase 대시보드 > Settings > API)
 *
 * 실행: npx tsx scripts/generate-blur-hashes.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { getPlaiceholder } from "plaiceholder";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 환경 변수가 설정되지 않았습니다.");
  console.error("NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY(또는 ANON_KEY)가 필요합니다.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateBlurHash(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch (error) {
    console.error(`\n   ⚠️ ${imageUrl}: ${error}`);
    return null;
  }
}

async function main() {
  console.log("🚀 blur hash 생성 시작...\n");

  // blur_data_url이 없는 이미지들 조회
  console.log("📷 blur_data_url이 없는 이미지 조회 중...");
  const { data: images, error: selectError } = await supabase
    .from("post_images")
    .select("id, url")
    .is("blur_data_url", null);

  if (selectError) {
    console.error("❌ 이미지 조회 실패:", selectError.message);
    console.error("\n💡 blur_data_url 컬럼이 없다면 Supabase SQL Editor에서 실행:");
    console.error("   ALTER TABLE post_images ADD COLUMN IF NOT EXISTS blur_data_url TEXT;");
    process.exit(1);
  }

  if (!images || images.length === 0) {
    console.log("✅ 모든 이미지에 blur hash가 있습니다!\n");
    return;
  }

  console.log(`   ${images.length}개 이미지 발견\n`);

  // 각 이미지에 blur hash 생성 및 업데이트
  console.log("🔄 blur hash 생성 및 업데이트 중...");
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    process.stdout.write(`   [${i + 1}/${images.length}] ${image.id.slice(0, 8)}...`);

    const blurDataUrl = await generateBlurHash(image.url);

    if (blurDataUrl) {
      const { error: updateError } = await supabase
        .from("post_images")
        .update({ blur_data_url: blurDataUrl })
        .eq("id", image.id);

      if (updateError) {
        console.log(` ❌ (${updateError.message})`);
        failCount++;
      } else {
        console.log(" ✅");
        successCount++;
      }
    } else {
      failCount++;
    }
  }

  console.log(`\n🎉 완료! 성공: ${successCount}, 실패: ${failCount}`);
}

main().catch(console.error);

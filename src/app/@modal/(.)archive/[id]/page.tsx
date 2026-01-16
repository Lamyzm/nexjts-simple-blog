import { notFound } from "next/navigation";

import type { PostFull } from "@/entities/post";

import { createStaticClient } from "@/lib/supabase/server";

import { ModalContent } from "./modal-content";

// ISR: 1시간마다 재검증
export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostModalPage({ params }: Props) {
  const { id } = await params;
  const supabase = createStaticClient();

  // 포스트 데이터 fetch
  const { data: post } = (await supabase
    .from("posts")
    .select(
      `
      *,
      author:authors(*),
      images:post_images(*)
    `
    )
    .eq("id", id)
    .single()) as { data: PostFull | null };

  if (!post) {
    notFound();
  }

  // 이미지 정렬
  if (post.images) {
    post.images.sort((a, b) => a.order_index - b.order_index);
  }

  // 댓글 데이터 fetch
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  return <ModalContent post={post} initialComments={comments ?? []} />;
}

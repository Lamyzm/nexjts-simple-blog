"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Comment } from "@/entities/comment";
import type { PostFull } from "@/entities/post";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCommentsByPost } from "@/entities/comment";
import { CommentForm } from "@/features/comment-create";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { CommentSection } from "@/widgets/CommentSection";
import { PostContent } from "@/widgets/PostDetail";

export function PostModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("post");
  const modalRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<PostFull | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  // 모달 내부 스크롤 감지
  const handleScroll = useCallback(() => {
    if (modalRef.current) {
      setScrolled(modalRef.current.scrollTop > 5);
    }
  }, []);

  // 모바일 감지 및 리다이렉트
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모바일에서는 상세 페이지로 리다이렉트
  useEffect(() => {
    if (isMobile && postId) {
      router.replace(`/archive/${postId}`);
    }
  }, [isMobile, postId, router]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (postId && !isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [postId, isMobile]);

  useEffect(() => {
    if (!postId) {
      setPost(null);
      setScrolled(false);
      return;
    }

    async function fetchData() {
      if (!postId) return;

      setLoading(true);

      const { data: postData } = (await supabase
        .from("posts")
        .select(
          `
          *,
          author:authors(*),
          images:post_images(*)
        `
        )
        .eq("id", postId)
        .single()) as { data: PostFull | null };

      if (postData) {
        if (postData.images) {
          postData.images.sort((a, b) => a.order_index - b.order_index);
        }
        setPost(postData);

        const commentData = await getCommentsByPost(postId);
        setComments(commentData);
      }

      setLoading(false);
    }

    fetchData();
  }, [postId, supabase]);

  const handleClose = () => {
    router.push("/archive", { scroll: false });
  };

  const refreshComments = async () => {
    if (!postId) return;
    const commentData = await getCommentsByPost(postId);
    setComments(commentData);
  };

  // 모바일이거나 postId가 없으면 렌더링하지 않음
  if (!postId || isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        onScroll={handleScroll}
        className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-zinc-950"
      >
        {/* Sticky Header */}
        <div
          className={cn(
            "sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between",
            scrolled ? "px-6 py-3" : "px-6 py-6"
          )}
        >
          {loading ? (
            <Skeleton className="h-6 w-1/3" />
          ) : post ? (
            <div className="min-w-0 flex-1 pr-4">
              <h1
                className={cn(
                  "font-bold font-mono tracking-wide truncate",
                  scrolled ? "text-base" : "text-xl"
                )}
              >
                {post.title}
              </h1>
              <p
                className={cn(
                  "font-mono text-zinc-400",
                  scrolled ? "text-xs" : "text-sm mt-1"
                )}
              >
                {post.author.name} ·{" "}
                {new Date(post.created_at).toLocaleDateString("ko-KR")}
              </p>
            </div>
          ) : (
            <div />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="shrink-0 text-zinc-400 hover:text-foreground"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="aspect-4/3 w-full" />
            </div>
          ) : post ? (
            <>
              <PostContent
                post={post}
                showHeader={false}
                className="mb-10"
              />

              <CommentSection
                comments={comments}
                postId={post.id}
                onRefresh={refreshComments}
              >
                <CommentForm postId={post.id} onSuccess={refreshComments} />
              </CommentSection>
            </>
          ) : (
            <p className="py-20 text-center text-zinc-500 font-mono">
              포스트를 찾을 수 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

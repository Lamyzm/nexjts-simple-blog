"use client";

import dayjs from "dayjs";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Comment } from "@/entities/comment";
import type { PostFull } from "@/entities/post";

import { Button } from "@/components/ui/button";
import { getCommentsByPost } from "@/entities/comment";
import { CommentForm } from "@/features/comment-create";
import { cn } from "@/lib/utils";
import { CommentSection } from "@/widgets/CommentSection";
import { PostContent } from "@/widgets/PostDetail";

interface ModalContentProps {
  post: PostFull;
  initialComments: Comment[];
}

export function ModalContent({ post, initialComments }: ModalContentProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [scrolled, setScrolled] = useState(false);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 스크롤 감지 (헤더 애니메이션용) - hysteresis로 떨림 방지
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const SCROLL_DOWN_THRESHOLD = 40;
    const SCROLL_UP_THRESHOLD = 10;

    const handleScroll = () => {
      const currentScroll = modal.scrollTop;
      setScrolled((prev) => {
        if (prev && currentScroll < SCROLL_UP_THRESHOLD) return false;
        if (!prev && currentScroll > SCROLL_DOWN_THRESHOLD) return true;
        return prev;
      });
    };

    modal.addEventListener("scroll", handleScroll, { passive: true });
    return () => modal.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => {
    router.back();
  };

  const refreshComments = async () => {
    const commentData = await getCommentsByPost(post.id);
    setComments(commentData);
  };

  // 스크롤 상태 변경 시 리렌더링 방지
  const memoizedPostContent = useMemo(
    () => <PostContent post={post} showHeader={false} className="mb-10" />,
    [post]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 데스크톱: 배경 오버레이 (클릭 시 닫기) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm hidden md:block"
        onClick={handleClose}
      />

      <div
        ref={modalRef}
        className="relative z-10 h-full w-full bg-zinc-950 md:h-auto md:max-h-[90vh] md:max-w-4xl overflow-y-auto overflow-x-hidden overscroll-contain"
        style={{ contain: "layout style" }}
      >
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-20 flex items-center justify-between",
            "px-4 md:px-6 transition-all duration-200 ease-out will-change-transform",
            scrolled
              ? "py-3 md:py-4 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-700 shadow-lg"
              : "py-4 md:py-5 bg-zinc-950 border-b border-zinc-800"
          )}
          style={{ transform: "translateZ(0)" }}
        >
          {/* 모바일: 뒤로가기 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="shrink-0 text-zinc-400 hover:text-foreground md:hidden"
          >
            <ArrowLeft className="size-5" />
          </Button>

          <div className="min-w-0 flex-1 mx-2">
            <h1
              className={cn(
                "font-bold font-mono tracking-wide truncate transition-all duration-200",
                scrolled ? "text-sm md:text-sm" : "text-lg md:text-xl"
              )}
            >
              {post.title}
            </h1>
            <p
              className={cn(
                "font-mono text-zinc-400 transition-all duration-200",
                scrolled ? "text-[9px] mt-0 opacity-70" : "text-xs mt-1"
              )}
            >
              {post.author.name} ·{" "}
              <time dateTime={post.created_at}>
                {dayjs(post.created_at).format("YYYY.MM.DD")}
              </time>
            </p>
          </div>

          {/* 데스크톱: X 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="shrink-0 text-zinc-400 hover:text-foreground hidden md:flex"
          >
            <X className="size-5" />
          </Button>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {memoizedPostContent}

          <CommentSection
            comments={comments}
            postId={post.id}
            onRefresh={refreshComments}
          >
            <CommentForm postId={post.id} onSuccess={refreshComments} />
          </CommentSection>
        </div>
      </div>
    </div>
  );
}

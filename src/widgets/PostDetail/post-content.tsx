"use client";

import type { PostFull } from "@/entities/post";

import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";

import { MarkdownViewer } from "./markdown-viewer";

interface PostContentProps {
  post: PostFull;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export function PostContent({
  post,
  showHeader = true,
  compact = false,
  className,
}: PostContentProps) {
  return (
    <article className={cn("w-full", className)}>
      {showHeader && (
        <header
          className={cn(
            "mb-6 pb-6 border-b border-zinc-800",
            compact && "mb-4 pb-4"
          )}
        >
          <h1
            className={cn(
              "font-bold font-mono tracking-wide",
              compact ? "text-xl" : "text-2xl md:text-3xl"
            )}
          >
            {post.title}
          </h1>
          <div
            className={cn(
              "mt-2 flex items-center gap-2 text-muted-foreground font-mono",
              compact ? "text-xs" : "text-sm"
            )}
          >
            <span className="font-medium text-foreground">
              {post.author.name}
            </span>
            <span>·</span>
            <time dateTime={post.created_at}>
              {dayjs(post.created_at).format("YYYY.MM.DD")}
            </time>
          </div>
        </header>
      )}

      {post.content && <MarkdownViewer content={post.content} />}
    </article>
  );
}

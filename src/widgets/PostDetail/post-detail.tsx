"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import type { PostFull } from "@/entities/post";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { PostContent } from "./post-content";

interface PostDetailProps {
  post: PostFull;
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/archive"
          className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
        >
          <ArrowLeft className="size-4" />
          Back to Archive
        </Link>
      </div>

      <PostContent post={post} />
    </div>
  );
}

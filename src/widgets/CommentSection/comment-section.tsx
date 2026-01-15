"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import type { Comment } from "@/entities/comment";

import { CommentItem } from "./comment-item";

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  children?: React.ReactNode; // CommentForm slot
  onRefresh?: () => void;
}

export function CommentSection({
  children,
  comments,
  onRefresh,
}: CommentSectionProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem("admin_auth") === "true");
  }, []);

  return (
    <section className="border-t border-zinc-800 pt-8">
      <div className="mb-6 flex items-center gap-2 text-zinc-400">
        <MessageCircle className="size-4" />
        <h2 className="text-sm font-mono tracking-wide">
          Comments ({comments.length})
        </h2>
      </div>

      {children}

      <div className="mt-6 space-y-3">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-zinc-600 font-mono text-sm">
            첫 번째 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isAdmin={isAdmin}
              onDelete={onRefresh}
            />
          ))
        )}
      </div>
    </section>
  );
}

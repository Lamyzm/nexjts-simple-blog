"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import type { Comment } from "@/entities/comment";

import { Button } from "@/components/ui/button";
import dayjs from "@/lib/dayjs";
import { createClient } from "@/lib/supabase/client";

interface CommentItemProps {
  comment: Comment;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export function CommentItem({ comment, isAdmin, onDelete }: CommentItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const handleDelete = () => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    startTransition(async () => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment.id);

      if (error) {
        toast.error("삭제 실패: " + error.message);
        return;
      }

      toast.success("댓글이 삭제되었습니다");
      if (onDelete) {
        onDelete();
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="group border-l-2 border-zinc-700 pl-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-300">{comment.nickname}</span>
          <span className="text-zinc-600">·</span>
          <time className="text-zinc-500" dateTime={comment.created_at}>
            {dayjs(comment.created_at).fromNow()}
          </time>
        </div>
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            disabled={isPending}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="size-3 text-destructive" />
          </Button>
        )}
      </div>
      <p className="mt-2 text-sm text-zinc-400 whitespace-pre-wrap">
        {comment.content}
      </p>
    </div>
  );
}

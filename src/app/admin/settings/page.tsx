"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const keyChangeSchema = z
  .object({
    currentKey: z.string().min(1, "현재 키를 입력해주세요"),
    newKey: z.string().min(4, "새 키는 최소 4자 이상이어야 합니다"),
    confirmKey: z.string().min(1, "새 키 확인을 입력해주세요"),
  })
  .refine((data) => data.newKey === data.confirmKey, {
    message: "새 키가 일치하지 않습니다",
    path: ["confirmKey"],
  });

type KeyChangeFormData = z.infer<typeof keyChangeSchema>;

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<KeyChangeFormData>({
    resolver: zodResolver(keyChangeSchema),
  });

  const onSubmit = (data: KeyChangeFormData) => {
    startTransition(async () => {
      const res = await fetch("/api/admin/settings", {
        body: JSON.stringify({
          currentKey: data.currentKey,
          newKey: data.newKey,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });

      const result = await res.json();

      if (result.success) {
        toast.success("관리자 키가 변경되었습니다");
        reset();
      } else {
        toast.error(result.message || "키 변경 실패");
      }
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <h2 className="text-2xl font-bold">설정</h2>

      <div className="rounded-lg border border-border bg-background p-6">
        <h3 className="mb-4 text-lg font-medium">관리자 키 변경</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentKey" className="text-sm font-medium">
              현재 키
            </label>
            <Input
              id="currentKey"
              type="password"
              placeholder="현재 관리자 키"
              {...register("currentKey")}
              aria-invalid={!!errors.currentKey}
            />
            {errors.currentKey && (
              <p className="text-sm text-destructive">
                {errors.currentKey.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="newKey" className="text-sm font-medium">
              새 키
            </label>
            <Input
              id="newKey"
              type="password"
              placeholder="새 관리자 키"
              {...register("newKey")}
              aria-invalid={!!errors.newKey}
            />
            {errors.newKey && (
              <p className="text-sm text-destructive">{errors.newKey.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmKey" className="text-sm font-medium">
              새 키 확인
            </label>
            <Input
              id="confirmKey"
              type="password"
              placeholder="새 관리자 키 확인"
              {...register("confirmKey")}
              aria-invalid={!!errors.confirmKey}
            />
            {errors.confirmKey && (
              <p className="text-sm text-destructive">
                {errors.confirmKey.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            loading={isPending}
          >
            키 변경
          </Button>
        </form>
      </div>
    </div>
  );
}

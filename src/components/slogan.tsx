"use client";

import { usePathname } from "next/navigation";

import { Show } from "@/components/ui/show";
import { useSecretAdmin } from "@/providers/secret-admin-provider";
import { siteConfig } from "@/site.config";

export function Slogan() {
  const { triggerDrag } = useSecretAdmin();

  // 관리자 페이지에서는 보이지 않도록 처리
  const pathname = usePathname();
  const isVisible = !pathname.includes("/admin");

  return (
    <Show when={isVisible}>
      <div className="max-w-[1450px] mx-auto w-full px-4 sm:px-8 pt-6">
        <p
          className="font-mono font-bold tracking-widest select-all "
          onDragEnd={triggerDrag}
          onMouseUp={() => {
            const selection = window.getSelection();
            if (selection && selection.toString().includes(siteConfig.slogan)) {
              triggerDrag();
            }
          }}
          draggable
        >
          &quot;{siteConfig.slogan}&quot;
        </p>
      </div>
    </Show>
  );
}

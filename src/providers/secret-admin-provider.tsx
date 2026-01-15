"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface SecretAdminContextType {
  triggerDrag: () => void;
  handleElementClick: () => void;
}

// 슬로건 선택후 nav 5번 클릭시 admin 페이지로 이동

const SecretAdminContext = createContext<SecretAdminContextType | null>(null);

export function SecretAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sloganDragged, setSloganDragged] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerDrag = useCallback(() => {
    setSloganDragged(true);
    setClickCount(0);

    // 기존 리셋 타임아웃 클리어
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    // 10초 후 리셋
    resetTimeoutRef.current = setTimeout(() => {
      setSloganDragged(false);
      setClickCount(0);
    }, 10000);
  }, []);

  const handleElementClick = () => {
    // admin 페이지에서는 동작하지 않음
    if (pathname.includes("/admin")) return;
    // 슬로건이 드래그 되어있지 않았다면 동작하지 않음
    if (!sloganDragged) return;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // 기존 타임아웃 클리어
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // 5번 클릭 시 admin 페이지로 이동
    if (newCount >= 5) {
      router.push("/admin");
      setSloganDragged(false);
      setClickCount(0);
      return;
    }

    // 2초 내에 다음 클릭이 없으면 리셋
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <SecretAdminContext.Provider value={{ handleElementClick, triggerDrag }}>
      {children}
    </SecretAdminContext.Provider>
  );
}

export function useSecretAdmin() {
  const context = useContext(SecretAdminContext);
  if (!context) {
    throw new Error("useSecretAdmin must be used within SecretAdminProvider");
  }
  return context;
}

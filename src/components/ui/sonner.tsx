"use client";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        error: <XCircle className="size-4" />,
        info: <Info className="size-4" />,
        loading: <Loader2 className="size-4 animate-spin" />,
        success: <CheckCircle2 className="size-4" />,
        warning: <AlertCircle className="size-4" />,
      }}
      style={
        {
          "--border-radius": "var(--radius)",
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };

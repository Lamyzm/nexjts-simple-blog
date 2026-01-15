"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import type { PostImage } from "@/entities/post";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: PostImage[];
  className?: string;
}

export function ImageGallery({ className, images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, goToPrevious, goToNext]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-[200px] items-center justify-center bg-zinc-900",
          className
        )}
      >
        <p className="text-zinc-600 font-mono text-sm">No images</p>
      </div>
    );
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative min-h-[300px] max-h-[70vh] overflow-hidden bg-zinc-900 flex items-center justify-center"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={images[currentIndex].url}
          alt={`Image ${currentIndex + 1}`}
          width={1200}
          height={900}
          className="w-full h-auto max-h-[70vh] object-contain"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
        />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleButtonClick(e, goToPrevious)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-zinc-400 hover:bg-black/70 hover:text-white z-10"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleButtonClick(e, goToNext)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-zinc-400 hover:bg-black/70 hover:text-white z-10"
            >
              <ChevronRight className="size-5" />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <>
          <div className="mt-4 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={cn(
                  "size-2 rounded-full transition-colors",
                  index === currentIndex
                    ? "bg-white"
                    : "bg-zinc-600 hover:bg-zinc-500"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          <div className="mt-2 text-center text-xs font-mono text-zinc-500">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

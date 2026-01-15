"use client";

import { Instagram } from "lucide-react";
import Image from "next/image";

import type { Author } from "@/entities/author";
import type { PostImage, PostWithAuthor } from "@/entities/post";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PostCard } from "@/widgets/PostCard";

type PostWithImages = PostWithAuthor & { images?: PostImage[] };

interface AuthorSectionProps {
  author: Author;
  posts: PostWithImages[];
  thumbnails?: Record<string, string>;
}

// 로컬 프로필 이미지 매핑 (DB에 avatar_url이 없을 때 사용)
const LOCAL_AVATARS: Record<string, string> = {
  baesongjun: "/chrome_sOc3M6zFW4.png",
};

export function AuthorSection({
  author,
  posts,
  thumbnails = {},
}: AuthorSectionProps) {
  if (posts.length === 0) return null;

  // DB avatar_url 또는 로컬 이미지 사용 (대소문자 무시)
  const avatarUrl =
    author.avatar_url || LOCAL_AVATARS[author.name.toLowerCase()] || null;

  const instagramHandle = author.instagram?.startsWith("@")
    ? author.instagram
    : author.instagram
      ? `@${author.instagram}`
      : null;

  const instagramUrl = author.instagram
    ? `https://instagram.com/${author.instagram.replace("@", "")}`
    : null;

  return (
    <section>
      <Accordion className="mb-6">
        <AccordionItem id={`author-${author.id}`} value={author.id} className="border-zinc-800">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={author.name}
                  width={32}
                  height={32}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-xs font-mono text-zinc-400">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="text-lg font-bold font-mono tracking-wide">
                {author.name}
              </h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="flex items-start gap-4 mt-2">
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="size-[120px] rounded-lg object-cover shrink-0"
                />
              )}
              <div className="space-y-2">
                {instagramHandle && instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    <Instagram className="size-4" />
                    {instagramHandle}
                  </a>
                )}
                {author.bio && (
                  <p className="text-sm text-zinc-500 font-mono leading-relaxed">
                    {author.bio}
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} thumbnail={thumbnails[post.id]} />
        ))}
      </div>
    </section>
  );
}

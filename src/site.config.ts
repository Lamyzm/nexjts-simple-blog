/**
 * 사이트 설정
 * 이 파일에서 사이트 전체 설정을 관리합니다.
 */

export const siteConfig = {
  // 기본 정보
  name: "We walk neary",
  description: "We walk neary - 각자의 감각을 찾고 탐구하는 사진 아카이브",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://wewalkneary.com",

  // 슬로건 (헤더 아래 표시)
  slogan: "We walk neary",

  // SEO 키워드
  keywords: ["사진", "아카이브", "포토", "갤러리", "we walk neary", "sandvill"],

  // 작성자 정보
  author: {
    name: "We walk neary",
    email: "jae040507@gmail.com",
  },

  // Footer
  footer: {
    since: "2026.01.12",
    contact: "jae040507@gmail.com",
  },

  // 소셜 링크 (선택)
  social: {
    instagram: "",
    twitter: "",
  },

  // OG 이미지
  ogImage: "/og-image.png",

  // 로케일
  locale: "ko_KR",
} as const;

export type SiteConfig = typeof siteConfig;

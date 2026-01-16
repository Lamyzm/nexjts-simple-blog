/**
 * 사이트 설정
 * 이 파일에서 사이트 전체 설정을 관리합니다.
 *
 * 🔧 사이트를 시작하기 전에 아래 값들을 수정하세요!
 */

export const siteConfig = {
  // 기본 정보
  name: "Your Site Name",
  description: "Your site description here",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",

  // 슬로건 (헤더 아래 표시)
  slogan: "Your Slogan Here",

  // SEO 키워드
  keywords: ["photo", "archive", "gallery"],

  // 작성자 정보
  author: {
    name: "Your Name",
    email: "your@email.com",
  },

  // Footer
  footer: {
    since: "20XX.XX.XX",
    contact: "your@email.com",
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

# Photo Archive Template

Next.js 16+ 기반 사진 아카이브/블로그 템플릿입니다.

## Features

- 사진 포스트 관리 (다중 이미지 지원)
- 작가별 아카이브 분류
- 이미지 블러 플레이스홀더 자동 생성
- 댓글 시스템
- 관리자 대시보드
- YouTube 영상 관리
- ISR (Incremental Static Regeneration) 적용
- 반응형 모달 (인터셉팅 라우트)
- SEO 최적화 (sitemap, robots, OG 태그)

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **React:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Storage)
- **State:** TanStack Query v5, Zustand

## Getting Started

### 1. 레포지토리 클론

```bash
git clone https://github.com/Lamyzm/nexjts-simple-blog.git my-archive
cd my-archive
```

### 2. 의존성 설치

```bash
# bun 사용 (권장)
bun install

# 또는 pnpm
pnpm install
```

### 3. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Storage에서 `post-images` 버킷 생성 (Public)

### 4. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일 수정:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=your-admin-password
```

### 5. 개발 서버 실행

```bash
bun dev
# http://localhost:3000
```

### 6. 사이트 커스터마이징

`src/app/layout.tsx`에서 수정:

```tsx
const SITE_URL = "https://your-domain.com";
const SITE_NAME = "Your Site Name";
const SITE_DESCRIPTION = "Your description";
```

Footer 연락처도 같은 파일에서 수정.

## Project Structure

```
src/
├── app/
│   ├── @modal/          # 인터셉팅 라우트 (모달)
│   ├── admin/           # 관리자 페이지
│   ├── archive/         # 아카이브 페이지
│   └── layout.tsx       # 루트 레이아웃
├── components/ui/       # shadcn/ui 컴포넌트
├── entities/            # 데이터 모델 (Post, Author, Comment)
├── features/            # 기능 (post-create, comment-create)
├── lib/                 # Supabase 클라이언트, 유틸리티
└── widgets/             # 복합 UI (PostCard, PostDetail)
```

## Database Schema

주요 테이블:

- `authors` - 작가 정보
- `posts` - 포스트
- `post_images` - 포스트 이미지 (blur_data_url 포함)
- `comments` - 댓글
- `videos` - YouTube 영상
- `site_settings` - 사이트 설정

자세한 스키마는 `supabase/schema.sql` 참조.

## Admin

`/admin`으로 접속하여 관리자 로그인.

- 포스트 작성/수정/삭제
- 작가 관리
- YouTube 영상 관리
- 사이트 설정

## Scripts

```bash
bun dev           # 개발 서버
bun build         # 프로덕션 빌드
bun start         # 프로덕션 서버
bun lint          # ESLint 검사
bun lint:fix      # ESLint 자동 수정
```

## Deployment

Vercel 배포 권장:

1. GitHub 레포지토리 연결
2. 환경 변수 설정
3. 자동 배포

## License

MIT

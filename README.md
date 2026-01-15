# Next.js FSD Template

A production-ready Next.js 16+ template with **Feature-Sliced Design** architecture.

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **React:** React 19
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS 4, shadcn/ui (Base UI)
- **Backend:** Supabase (PostgreSQL, Auth)
- **State Management:**
  - URL State: `nuqs`
  - Global UI State: `zustand`
  - Server State: `TanStack Query` v5
- **Form:** `react-hook-form` + `zod`
- **Date:** `dayjs`
- **Icons:** `lucide-react`

## Getting Started

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 수정하여 Supabase 정보 입력

# 3. 개발 서버 실행
pnpm dev
```

## Project Structure (FSD)

```
src/
├── app/           # 라우팅, 레이아웃, 페이지 컴포지션
├── components/    # 공통 UI 컴포넌트 (shadcn/ui)
├── entities/      # 데이터 모델, 타입, 간단한 UI 카드
├── features/      # 복잡한 사용자 상호작용, 비즈니스 로직
├── hooks/         # 커스텀 React 훅
├── lib/           # 유틸리티, API 클라이언트
├── shared/        # 재사용 유틸리티, 상수, 타입
└── widgets/       # 복합 UI 블록 (헤더, 사이드바 등)
```

## Adding UI Components

shadcn/ui 컴포넌트 추가:

```bash
# 단일 컴포넌트 추가
pnpm dlx shadcn@latest add dialog

# 여러 컴포넌트 추가
pnpm dlx shadcn@latest add dialog dropdown-menu tabs
```

## Available Scripts

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버 실행
pnpm lint         # ESLint 검사
pnpm lint:fix     # ESLint 자동 수정
pnpm test         # Jest 테스트 실행
pnpm test:e2e     # Playwright E2E 테스트
```

## Code Conventions

### Component Structure

```tsx
// 함수형 컴포넌트 + named export
interface EventCardProps {
  title: string;
  date: Date;
}

export function EventCard({ title, date }: EventCardProps) {
  return <div>{title}</div>;
}
```

### Import Rules

```tsx
// 절대 경로 사용
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 상대 경로 금지
// import { Button } from "../../components/ui/button"; ❌
```

### Data Fetching

- **읽기 (Server):** Server Components에서 Supabase 직접 호출
- **읽기 (Client):** TanStack Query `useSuspenseQuery`
- **쓰기:** Server Actions 사용

## Environment Variables

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (선택)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_CLARITY_ID=
```

## License

MIT

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

---

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

---

## Supabase 설정 (상세 가이드)

### Step 1: Supabase 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 접속
2. **Start your project** 클릭 → GitHub 계정으로 로그인
3. **New project** 클릭
4. 프로젝트 정보 입력:
   - **Name:** `my-archive` (원하는 이름)
   - **Database Password:** 안전한 비밀번호 입력 (저장해두세요)
   - **Region:** `Northeast Asia (Seoul)` 권장
5. **Create new project** 클릭 → 2-3분 대기

### Step 2: 데이터베이스 테이블 생성

1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. `supabase/schema.sql` 파일 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭 (또는 Ctrl+Enter)
5. "Success. No rows returned" 메시지 확인

생성되는 테이블:
| 테이블 | 설명 |
|--------|------|
| `authors` | 작가 정보 (이름, 인스타그램, 소개) |
| `posts` | 포스트 (제목, 내용, 작성일) |
| `post_images` | 포스트 이미지 (URL, 블러 데이터) |
| `comments` | 댓글 (닉네임, 내용) |
| `site_settings` | 사이트 설정 |

### Step 3: Storage 버킷 생성 (이미지 저장용)

1. 왼쪽 메뉴에서 **Storage** 클릭
2. **New bucket** 클릭
3. 버킷 설정:
   - **Name:** `post-images` (정확히 이 이름으로)
   - **Public bucket:** ✅ 체크 (중요!)
4. **Create bucket** 클릭

### Step 4: Storage 정책 설정

1. 생성된 `post-images` 버킷 클릭
2. 상단 **Policies** 탭 클릭
3. **New policy** 클릭
4. **For full customization** 선택

**읽기 정책 (SELECT):**
```sql
-- Policy name: Public Read
-- Allowed operation: SELECT
-- Target roles: (비워두기 = 모든 사용자)
-- USING expression:
true
```

**업로드 정책 (INSERT):**
```sql
-- Policy name: Auth Upload
-- Allowed operation: INSERT
-- Target roles: (비워두기)
-- WITH CHECK expression:
true
```

**삭제 정책 (DELETE):**
```sql
-- Policy name: Auth Delete
-- Allowed operation: DELETE
-- Target roles: (비워두기)
-- USING expression:
true
```

> 💡 간단하게 하려면: **Get started quickly** → **Allow access to all users** 선택

### Step 5: API 키 확인

1. 왼쪽 메뉴에서 **Project Settings** (톱니바퀴 아이콘) 클릭
2. **API** 메뉴 클릭
3. 다음 값들을 복사:

| 항목 | 위치 | 용도 |
|------|------|------|
| **Project URL** | `https://xxxxx.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** | `eyJhbGciOiJI...` (긴 문자열) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

### Step 6: 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일 수정:

```env
# 사이트 URL (배포 전에는 localhost)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (Step 5에서 복사한 값)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 관리자 비밀번호 (원하는 값으로 설정)
ADMIN_PASSWORD=my-secure-admin-password
```

### Step 7: 개발 서버 실행

```bash
bun dev
```

http://localhost:3000 접속하여 확인!

---

## 초기 데이터 설정

### 작가 추가

1. `/admin` 접속 → 비밀번호 입력
2. **Authors** 메뉴 → **새 작가 추가**
3. 이름, 인스타그램(선택), 소개(선택) 입력

### 첫 포스트 작성

1. `/admin` → **Posts** → **새 포스트**
2. 작가 선택, 제목 입력
3. 이미지 업로드 (드래그 앤 드롭)
4. 내용 작성 (마크다운 지원)
5. **저장**

---

## 사이트 커스터마이징

모든 사이트 설정은 `src/site.config.ts` 파일 하나에서 관리합니다.

```typescript
// src/site.config.ts
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
};
```

**수정할 항목:**
- `name` - 사이트 이름 (브라우저 탭, SEO)
- `description` - 사이트 설명 (SEO)
- `slogan` - 헤더 아래 표시되는 슬로건
- `keywords` - SEO 키워드
- `author` - 작성자 정보
- `footer` - 하단 Since 날짜, 연락처

---

## Project Structure

```
src/
├── app/
│   ├── @modal/          # 인터셉팅 라우트 (모달)
│   ├── admin/           # 관리자 페이지
│   ├── archive/         # 아카이브 페이지
│   └── layout.tsx       # 루트 레이아웃 + 메타데이터
├── components/ui/       # shadcn/ui 컴포넌트
├── entities/            # 데이터 모델 (Post, Author, Comment)
├── features/            # 기능 (post-create, comment-create)
├── lib/                 # Supabase 클라이언트, 유틸리티
└── widgets/             # 복합 UI (PostCard, PostDetail)
```

---

## Deployment (Vercel)

### 1. Vercel 연결

1. [https://vercel.com](https://vercel.com) 접속 → GitHub 로그인
2. **Add New Project** → 레포지토리 선택
3. **Import**

### 2. 환경 변수 설정

Vercel 프로젝트 설정에서 Environment Variables 추가:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
ADMIN_PASSWORD=your-admin-password
```

### 3. 배포

**Deploy** 클릭 → 자동 배포 완료!

> 커스텀 도메인 연결: Settings → Domains에서 설정

---

## Troubleshooting

### "테이블을 찾을 수 없습니다" 에러
→ SQL Editor에서 `schema.sql` 실행했는지 확인

### 이미지 업로드 실패
→ Storage 버킷이 `post-images`인지, Public 설정인지 확인

### 관리자 로그인 안됨
→ `.env.local`의 `ADMIN_PASSWORD` 확인

### 빌드 에러
```bash
bun run build
```
에러 메시지 확인 후 해결

---

## Scripts

```bash
bun dev           # 개발 서버
bun build         # 프로덕션 빌드
bun start         # 프로덕션 서버
bun lint          # ESLint 검사
bun lint:fix      # ESLint 자동 수정
```

---

## License

MIT

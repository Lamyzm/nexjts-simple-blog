# Supabase 설정 가이드

이 문서는 "We walk neary" 프로젝트의 Supabase 설정 방법을 설명합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전 설정 후 생성

## 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin (관리자 로그인 키 env.local에 설정)
ADMIN_KEY=your-secret-admin-key
```

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 대시보드 → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 대시보드 → Settings → API → anon public key

## 3. 데이터베이스 테이블 생성

Supabase 대시보드 → SQL Editor에서 아래 SQL을 실행합니다.

### 3.1 테이블 생성

```sql
-- 작성자 테이블
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  instagram TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포스트 테이블
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포스트 이미지 테이블
CREATE TABLE post_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 댓글 테이블
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 RLS (Row Level Security) 정책 설정

```sql
-- authors 테이블
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authors_select" ON authors
  FOR SELECT USING (true);

CREATE POLICY "authors_insert" ON authors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "authors_update" ON authors
  FOR UPDATE USING (true);

CREATE POLICY "authors_delete" ON authors
  FOR DELETE USING (true);

-- posts 테이블
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select" ON posts
  FOR SELECT USING (true);

CREATE POLICY "posts_insert" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "posts_update" ON posts
  FOR UPDATE USING (true);

CREATE POLICY "posts_delete" ON posts
  FOR DELETE USING (true);

-- post_images 테이블
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_images_select" ON post_images
  FOR SELECT USING (true);

CREATE POLICY "post_images_insert" ON post_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "post_images_update" ON post_images
  FOR UPDATE USING (true);

CREATE POLICY "post_images_delete" ON post_images
  FOR DELETE USING (true);

-- comments 테이블
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select" ON comments
  FOR SELECT USING (true);

CREATE POLICY "comments_insert" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "comments_delete" ON comments
  FOR DELETE USING (true);
```

## 4. Storage 버킷 설정

### 4.1 버킷 생성

Supabase 대시보드 → Storage → New bucket

- **Name**: `post-images`
- **Public bucket**: 체크 (활성화)

### 4.2 Storage 정책 설정

Storage → Policies → `post-images` 버킷 선택 → New policy

**SELECT (읽기) 정책:**
```sql
CREATE POLICY "public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');
```

**INSERT (업로드) 정책:**
```sql
CREATE POLICY "public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images');
```

**DELETE (삭제) 정책:**
```sql
CREATE POLICY "public_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'post-images');
```

또는 SQL Editor에서 한번에 실행:

```sql
-- Storage 정책 (post-images 버킷)
CREATE POLICY "post_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "post_images_public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "post_images_public_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'post-images');
```

## 5. 프로젝트 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 6. 관리자 접속 방법

### 일반 접속
`/admin/login` 페이지에서 `.env.local`에 설정한 `ADMIN_KEY` 입력

### 시크릿 접속
1. 메인 페이지에서 "We walk neary" 텍스트를 드래그
2. 네비게이션 바 영역을 5번 클릭
3. 자동으로 `/admin` 페이지로 이동

## 7. 폴더 구조

```
src/
├── app/
│   ├── admin/          # 관리자 페이지
│   ├── archive/        # 아카이브 (포스트 목록/상세)
│   └── introduce/      # 소개 페이지
├── components/         # 공통 컴포넌트
├── entities/           # 도메인 엔티티 (author, post, comment)
├── features/           # 기능 (post-create, comment-create)
├── lib/
│   └── supabase/       # Supabase 클라이언트
├── providers/          # Context Providers
└── widgets/            # 위젯 컴포넌트
```

## 8. 문제 해결

### 이미지 업로드 실패
- Storage 버킷이 public으로 설정되어 있는지 확인
- Storage 정책이 올바르게 설정되어 있는지 확인

### 테이블 컬럼 누락 에러
- 누락된 컬럼을 추가하는 ALTER TABLE 실행:
```sql
-- 예: avatar_url 컬럼 추가
ALTER TABLE authors ADD COLUMN avatar_url TEXT;
```

### RLS 정책 에러
- RLS가 활성화되어 있는지 확인
- 적절한 정책이 설정되어 있는지 확인

# 구리교회 추억 전시관

행사 이벤트 중 자신의 추억을 사진과 함께 업로드하고, 다른 사람이 남긴 추억도 모바일에서 바로 볼 수 있는 Next.js 앱입니다.

## 기능

- 이름, 설명, 이미지로 추억 등록
- 이미지는 AWS S3에 직접 업로드
- 메타데이터는 Firebase Realtime Database에 저장
- 메인 전시관에서 카드 리스트로 보기
- 카드 클릭 시 모달에서 이름, 설명, 이미지 상세 보기
- 모바일 우선 UI

## 실행 방법

1. 의존성 설치

```bash
yarn install
```

2. 환경변수 작성

```bash
cp .env.example .env.local
```

`Firebase Web SDK` 공개 설정값은 주신 프로젝트 기준으로 `.env.example`에 이미 채워두었습니다.
아래 항목 중 AWS S3 값만 채워 주세요. Firebase는 공개 설정만으로 동작하도록 맞춰두었습니다.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAux6ehG-AfIyUJrieAgNRIqhesdRhCJ2s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=guri-church-school.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://guri-church-school-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=guri-church-school
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=guri-church-school.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=630678916897
NEXT_PUBLIC_FIREBASE_APP_ID=1:630678916897:web:7466cef2f349064678f860
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-QYEJ38HJ7R

AWS_REGION=
AWS_S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_PUBLIC_BASE_URL=
```

3. 개발 서버 실행

```bash
yarn dev
```

## Firebase 설정

- `NEXT_PUBLIC_FIREBASE_*` 값은 `guri-church-school` 프로젝트 기준으로 이미 반영했습니다.
- 클라이언트에서는 Firebase Web SDK 초기화와 Analytics 연결에 이 공개 설정을 사용합니다.
- 서버의 목록 조회와 저장도 Realtime Database REST 방식으로 처리해서 서비스 계정 키 없이 동작합니다.
- 따라서 추가 Firebase 서버 키 없이 `NEXT_PUBLIC_FIREBASE_DATABASE_URL` 만 있으면 됩니다.
- 단, Realtime Database Rules 에서 현재 앱이 읽기/쓰기를 허용해야 합니다.

## AWS S3 설정

- 업로드용 버킷을 준비합니다.
- 이미지 업로드는 Next.js 서버가 AWS SDK로 S3에 직접 전송합니다.
- 업로드된 이미지를 브라우저에서 볼 수 있도록 버킷 정책 또는 CDN 공개 경로를 준비해야 합니다.
- `AWS_S3_PUBLIC_BASE_URL` 은 공개 이미지 기준 URL입니다.
  예시:
  - CloudFront 사용 시: `https://cdn.example.com`
  - S3 공개 버킷 사용 시: `https://your-bucket.s3.ap-northeast-2.amazonaws.com`

## 데이터 구조

Realtime Database 경로:

```text
/memories/{memoryId}
```

각 항목은 아래 필드를 저장합니다.

- `id`
- `name`
- `description`
- `imageUrl`
- `imageKey`
- `imageWidth`
- `imageHeight`
- `createdAt`
- `updatedAt`
- `status`

## 주요 경로

- `/` : 추억 전시관
- `/upload` : 추억 등록 페이지
- `GET /api/memories` : 추억 목록 조회
- `POST /api/memories` : 이미지 S3 업로드 후 추억 메타데이터 저장

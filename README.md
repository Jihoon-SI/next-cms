## CMS 컨텐츠 가이드

### 프로젝트 개요

Bizxpress CMS에서 작성한 컨텐츠(`.shtm`)를 Next.js 페이지 내 iframe으로 렌더링하는 프로젝트입니다.  
`output: "export"` 방식으로 정적 빌드하여 웹 서버에 배포합니다.

### 환경 구성

#### 전제

- `output: "export"` 를 통한 static 배포 상황을 전제로 구현되었습니다.
- Bizxpress를 통해 작성한 CMS 컨텐츠가 **웹 서버**에서 관리되는 상황을 전제하였습니다.

#### 경로 구성 (web)

```
(root)
  ├─ webponent-press
  │   └─ ...
  ├─ press-common
  │   └─ external
  │       └─ fonts
  │           └─ ...
  ├─ solution
  │   ├─ bizxpress-extensions.shtm
  │   ├─ ...
  │   └─ __media
  │       └─ ...
  ├─ index.html
  └─ ...
```

1. **webponent-press**
   - bizxpress의 내장 기능 js, css 라이브러리
   - cms에서 작성한 테마 css 파일은 `/webponent-press/css/theme/` 위치에 배포됨.
   - coreframe 환경에서는 컨텐츠 루트(`src/main/webapp/`) 경로에 위치
2. **press-common**
   - webponent-press가 의존하는 공통 자원 목록
   - 주로 font 파일이 해당됨
   - coreframe 환경에서는 `src/main/webapp/WEB-APP/`에 위치
3. **solution**
   - bizxpress를 통해 생성한 컨텐츠(`.shtm`)와 미디어 파일(`/__media/`) 예시 경로
   - bizxpress 설정에 따라 경로 달라질 수 있음
4. **index.html**
   - Next.js 빌드 결과 index.html

---

### 구현 내용

1. 디렉토리 및 파일 추가
   - /webponent-press
   - /press-common/external/fonts
2. 경로 수정
   - css/webponent.press.css
   - webponent.press.tistory.css
   - press2.0/webponent.press.css
     - `/WEB-APP/...` 경로를 수정
3. 폰트 파일 추가
   - css/theme/font.css 생성
   - import font.css (현재는 solution.css에 import 되어있으나, bizxpress를 통해 변경되는 파일이므로 다른 곳에서 import 필요)
4. CMS 컨텐츠 추가
   - /solution
5. Next.js
   - 환경변수 설정, hook 구현

---

### Nextjs 주요 동작 방식

#### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
NEXT_PUBLIC_WEB_ROOT=http://127.0.0.1:8887
```

- `NEXT_PUBLIC_WEB_ROOT`: CMS 컨텐츠가 서빙되는 웹 서버 루트 URL
- 개발 서버에서는 `next.config.ts`의 `rewrites`가 이 URL로 프록시하여 CORS를 우회합니다.
- 프로덕션 빌드에서는 클라이언트가 이 URL로 직접 요청합니다.

#### 프로젝트 구조

```
src/
├─ app/
│   ├─ layout.tsx          # QueryClientProvider 등 전역 설정
│   ├─ page.tsx            # 메인 페이지 (CMS 컨텐츠 선택 및 렌더링)
│   └─ globals.css
├─ components/
│   └─ cms-iframe.tsx      # CMS HTML을 iframe으로 렌더링하는 컴포넌트
└─ hooks/
    └─ useCmsContents.ts   # CMS 컨텐츠 fetch 훅
```

#### `useCmsContents` 훅

- 환경에 따라 fetch URL을 다르게 구성합니다.
  - **개발**: 상대 경로(`/solution/...`)로 요청 → `next.config.ts` rewrites가 `NEXT_PUBLIC_WEB_ROOT`로 프록시
  - **프로덕션**: `NEXT_PUBLIC_WEB_ROOT` + 경로로 절대 URL 직접 요청
- TanStack Query로 결과를 캐싱합니다.

#### `CmsIframe` 컴포넌트

- `srcDoc`에 fetch한 HTML 문자열을 주입하여 iframe으로 렌더링합니다.
- `ResizeObserver`로 iframe 내부 콘텐츠 높이를 감지해 자동으로 높이를 맞춥니다.
- `sandbox="allow-scripts allow-same-origin allow-forms allow-popups"` 속성으로 CMS 스크립트 실행을 허용합니다.

#### CMS 컨텐츠 경로 추가 (`page.tsx`)

`PATH_LIST` 배열에 항목을 추가하면 드롭다운에 노출됩니다.

```ts
const PATH_LIST = [
  { label: "표시 이름", value: "solution/파일명.shtm" },
  // ...
];
```

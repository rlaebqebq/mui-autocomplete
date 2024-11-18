## 해야하는 일
- optionList 위아래로 전환될때 깜빡이는 부분 수정

<br />
<br />
<br />

# Mui AutoCompelete 클론

<img src="https://github.com/user-attachments/assets/0ff93ac2-35d1-449e-bc16-6332d30124dc" height="300"/>

## 기술스택
`React`, `TypeScript`, `CSS`, `React Testing Library`, `Jest`, `pnpm`

## 실행 방법
- 프로젝트에 필요한 패키지 설치
```bash
pnpm install
pnpm start
pnpm test
```

## 디렉토리 구조
```
🗂️
├── README.md
├── custom.d.ts                         # svg 파일을 React 컴포넌트로 처리하기 위한 타입 정의
├── package.json
├── pnpm-lock.yaml
├── public/
├── readme_assets/
├── src/
│ ├── DemoPage/
│ │ ├── fetchTop100Films.ts             # 샘플 데이터 요청 함수 정의
│ │ ├── index.tsx                       # 데모 페이지
│ │ ├── style.css                       # 데모 페이지 css 파일
│ │ └── top100Films.json                # 샘플 데이터
│ ├── Select/
│ │ ├── Select.test.tsx                 # Select 컴포넌트 테스트 파일
│ │ ├── SelectComponent.tsx             # Select 컴포넌트 구현
│ │ ├── assets/                         # Select 컴포넌트에 사용한 svg 폴더
│ │ ├── index.tsx                       # Select 컴포넌트 엔트리 파일
│ │ ├── style.css                       # Select 컴포넌트 css 파일
│ │ └── utils/
│ │     ├── debounce.ts                 # debounce 정의
│ │     ├── option.d.ts                 # Select 컴포넌트 option 타입 정의
│ │     ├── position.d.ts               # Select 컴포넌트의 option 목록 위치 타입 정의
│ │     ├── useAdjustTextarea.tsx       # Select 검색창 높이 조정 커스텀 훅
│ │     ├── useClickAway.tsx            # Select 외부 클릭/포커스 아웃 시 optionList 닫는 커스텀 훅
│ │     ├── useDropdownKeyHandler.tsx   # Select 키보드 입력 및 선택한 option 노출 관련 커스텀 훅
│ │     ├── useDropdownPosition.tsx     # Select optionList 위치/크기 관련 커스텀 훅
│ │     └── useResolveFilterOptions.tsx # Select 컴포넌트 props인 option(배열/함수) 처리 커스텀 훅
│ ├── index.tsx
│ └── setupTests.ts
└── tsconfig.json
```

<br />

## 프로젝트 테스트코드 실행결과
```
 PASS  src/Select/Select.test.tsx (8.419 s)
  Select 테스트
    Select에 선택된 값이 없고 options로 배열을 전달
      ✓ option을 검색할 수 있어야 한다 (197 ms)
      ✓ Select를 클릭하면 선택 가능한 option들이 나타나야 한다 (44 ms)
      ✓ 마우스를 사용해 option을 선택할 수 있어야 한다 (40 ms)
      ✓ Select에서 위 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다 (34 ms)
      ✓ Select에서 아래 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다 (35 ms)
      ✓ 키보드를 사용해 option을 선택할 수 있어야 한다 (26 ms)
      ✓ 키보드 엔터키를 누르면 option을 선택할 수 있어야 한다 (25 ms)
      ✓ option을 선택하지 않고 select에서 focus가 벗어나면 검색어가 삭제된다 (16 ms)
    Select에 선택된 값이 없고 options로 함수를 전달
      ✓ option을 검색할 수 있어야 한다 (332 ms)
      ✓ Select를 클릭하면 선택 가능한 option들이 나타나야 한다 (333 ms)
      ✓ 마우스를 사용해 option을 선택할 수 있어야 한다 (339 ms)
      ✓ Select에서 위 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다 (329 ms)
      ✓ Select에서 아래 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다 (328 ms)
      ✓ 키보드를 사용해 option을 선택할 수 있어야 한다 (326 ms)
      ✓ 키보드 엔터키를 누르면 option을 선택할 수 있어야 한다 (322 ms)
      ✓ option을 선택하지 않고 select에서 focus가 벗어나면 검색어가 삭제된다 (316 ms)
    Select에 선택된 값이 있고 options로 배열을 전달
      ✓ option을 검색할 수 있어야 한다 (24 ms)
      ✓ Select를 클릭하면 선택 가능한 option들이 나타나야 한다 (22 ms)
      ✓ 마우스를 사용해 option을 선택할 수 있어야 한다 (22 ms)
      ✓ Select에서 위 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다 (22 ms)
      ✓ Select에서 아래 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다 (22 ms)
      ✓ 키보드를 사용해 option을 선택할 수 있어야 한다 (21 ms)
      ✓ 키보드 엔터키를 누르면 option을 선택할 수 있어야 한다 (20 ms)
      ✓ option들이 나타날때 선택된 option이 보이고 강조되어야 한다 (26 ms)
      ✓ 키보드를 이용해 option을 순회할 때, 선택된 option이 시작지점이 되어야 한다 (24 ms)
    Select에 선택된 값이 있고 options로 함수를 전달
      ✓ option을 검색할 수 있어야 한다 (334 ms)
      ✓ Select를 클릭하면 선택 가능한 option들이 나타나야 한다 (326 ms)
      ✓ 마우스를 사용해 option을 선택할 수 있어야 한다 (329 ms)
      ✓ Select에서 위 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다 (330 ms)
      ✓ Select에서 아래 방향 키보드를 누르면 선택 가능한 option들이 나타나야 한다 (328 ms)
      ✓ 키보드를 사용해 option을 선택할 수 있어야 한다 (322 ms)
      ✓ 키보드 엔터키를 누르면 option을 선택할 수 있어야 한다 (323 ms)
      ✓ option들이 나타날때 선택된 option이 보이고 강조되어야 한다 (332 ms)
      ✓ 키보드를 이용해 option을 순회할 때, 선택된 option이 시작지점이 되어야 한다 (328 ms)

Test Suites: 1 passed, 1 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        9.983 s
Ran all test suites related to changed files.
```

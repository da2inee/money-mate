# MoneyMate 개발자 가이드

개발 환경 구성, 코드 구조, 컨벤션, 빌드·실행 방법을 정리합니다.

---

## 목차

1. [필수 환경](#1-필수-환경)
2. [저장소 클론 후 설정](#2-저장소-클론-후-설정)
3. [프론트엔드 개발](#3-프론트엔드-개발)
4. [백엔드 개발](#4-백엔드-개발)
5. [코드 컨벤션](#5-코드-컨벤션)
6. [디버깅](#6-디버깅)
7. [테스트 실행](#7-테스트-실행)
8. [문서·참고](#8-문서참고)

---

## 1. 필수 환경

### 1.1 공통

- **Git**
- **Node.js** 18+ (LTS 권장), **npm** (또는 yarn/pnpm)
- **JDK 21** (백엔드)
- **MySQL 8.x** (로컬 또는 원격 DB)

### 1.2 로컬 MySQL 설정

- MySQL 서버 실행
- 데이터베이스 생성: `CREATE DATABASE money_mate ...`
- `money-mate-server/src/main/resources/application.properties` 에서  
  `spring.datasource.url`, `username`, `password` 를 환경에 맞게 수정

---

## 2. 저장소 클론 후 설정

```bash
# 클론
git clone <저장소 URL>
cd MoneyMate

# 프론트엔드 의존성
cd money-mate-client && npm install && cd ..

# 백엔드 (Gradle 래퍼 사용)
cd money-mate-server && ./gradlew build && cd ..
```

---

## 3. 프론트엔드 개발

### 3.1 디렉터리 구조

```
money-mate-client/src/
├── App.tsx                 # 라우팅
├── index.css               # 전역 스타일
├── index.tsx               # 진입점
├── api/                    # API 호출
│   ├── budgetApi.ts
│   ├── expenseApi.ts
│   └── travelerApi.ts
├── components/             # 공통·페이지별 컴포넌트
│   ├── common/
│   │   └── MButton.tsx
│   ├── BudgetList.tsx
│   ├── ExpenseForm.tsx
│   └── ExpenseList.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── HomePage.css
│   ├── JejuPage.tsx
│   └── JejuPage.css
└── utils/
    └── settlement.ts       # 정산 제안 로직
```

### 3.2 실행

```bash
cd money-mate-client
npm start
```

- 기본 주소: http://localhost:3000
- 백엔드가 8080에서 떠 있어야 API 호출이 동작합니다.

### 3.3 빌드

```bash
npm run build
```

- `build/` 에 정적 파일이 생성됩니다.
- `npm run start:light` 로 빌드 후 `serve -s build` 로 로컬에서 확인 가능.

### 3.4 API 베이스 URL 변경

- `api/expenseApi.ts`, `budgetApi.ts`, `travelerApi.ts` 상단의 `API_BASE_URL` 또는 `API_BASE_URL` 변수를 수정합니다.
- 프로덕션에서는 환경 변수(예: `REACT_APP_API_URL`)로 분리하는 것을 권장합니다.

---

## 4. 백엔드 개발

### 4.1 디렉터리 구조

```
money-mate-server/src/main/
├── java/.../money_mate_server/
│   ├── controller/         # REST 컨트롤러
│   ├── service/            # 비즈니스 로직
│   ├── mapper/             # MyBatis Mapper
│   ├── model/              # 엔티티
│   └── dto/                # 요청/응답 DTO
└── resources/
    ├── application.properties
    └── mybatis/mapper/
        ├── BudgetMapper.xml
        ├── ExpenseMapper.xml
        └── TravelerMapper.xml
```

### 4.2 실행

```bash
cd money-mate-server
./gradlew bootRun
```

- 기본 포트: 8080
- MySQL이 떠 있고 `application.properties` 설정이 맞아야 합니다.

### 4.3 빌드

```bash
./gradlew build
```

- JAR: `build/libs/` 에 생성됩니다.
- `java -jar build/libs/...jar` 로 실행 가능 (MySQL 등 설정은 동일 적용).

### 4.4 DB 스키마

- 테이블이 없으면 JPA `ddl-auto=update` 등으로 생성될 수 있음 (설정에 따름).
- 수동 생성 시 `docs/DATABASE_SCHEMA.md` 의 DDL 예시를 참고합니다.

---

## 5. 코드 컨벤션

### 5.1 프론트엔드 (TypeScript/React)

- **파일명**: 컴포넌트는 PascalCase (예: `BudgetList.tsx`), 유틸/API는 camelCase (예: `settlement.ts`, `expenseApi.ts`).
- **컴포넌트**: 함수형 컴포넌트 + `React.FC` 또는 함수 선언 시 타입 명시.
- **스타일**: 페이지/컴포넌트별 `.css` import, `:root` CSS 변수 활용.
- **API**: `api/` 디렉터리에서 axios 호출만 담당, 비즈니스 로직은 페이지/유틸에서.

### 5.2 백엔드 (Java)

- **패키지**: `com.example.money_mate_server` 하위에 controller, service, mapper, model, dto.
- **네이밍**: REST 리소스는 복수형 (예: `/expenses`, `/budget`), 메서드명은 get/post/update/delete 등 동작 반영.
- **예외**: 컨트롤러에서 try-catch 시 500 등 적절한 HTTP 상태 코드 반환 권장.

---

## 6. 디버깅

- **프론트**: 브라우저 개발자 도구 (Network, Console). API 베이스 URL·CORS 확인.
- **백엔드**: IDE에서 `MoneyMateServerApplication` 실행 후 breakpoint. `application.properties` 의 로깅 레벨 조정 (예: `logging.level.com.example=DEBUG`).
- **DB**: MySQL 클라이언트로 `money_mate` DB 접속해 expenses, budgets, travelers 테이블 확인.

---

## 7. 테스트 실행

- **프론트**: `cd money-mate-client && npm test`
- **백엔드**: `cd money-mate-server && ./gradlew test`

(테스트 코드가 추가되면 위 명령으로 실행 가능합니다.)

---

## 8. 문서·참고

- **프로젝트 개요**: [docs/PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
- **API 명세**: [docs/API_SPECIFICATION.md](API_SPECIFICATION.md)
- **아키텍처**: [docs/ARCHITECTURE.md](ARCHITECTURE.md)
- **DB 스키마**: [docs/DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
- **배포**: [docs/DEPLOYMENT.md](DEPLOYMENT.md) (해당 문서가 있는 경우)

---

*문서 버전: 1.0 | MoneyMate 개발자 가이드*

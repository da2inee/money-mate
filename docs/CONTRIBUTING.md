# MoneyMate 기여 가이드

MoneyMate 프로젝트에 기여하는 방법과 코드 스타일, PR 절차를 안내합니다.

---

## 목차

1. [시작하기](#1-시작하기)
2. [개발 환경](#2-개발-환경)
3. [브랜치·커밋](#3-브랜치커밋)
4. [코드 스타일](#4-코드-스타일)
5. [테스트](#5-테스트)
6. [Pull Request](#6-pull-request)
7. [문서](#7-문서)

---

## 1. 시작하기

- 저장소를 fork한 뒤 clone합니다.
- 이슈에서 작업할 항목을 확인하거나, 새 이슈를 생성해 제안합니다.
- 큰 변경은 먼저 이슈/토론으로 방향을 맞추는 것을 권장합니다.

---

## 2. 개발 환경

- **필수**: Node.js 18+, JDK 21, MySQL 8.x
- **설정**: [docs/DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) 참고
- 프론트: `money-mate-client` 에서 `npm install && npm start`
- 백엔드: `money-mate-server` 에서 `./gradlew bootRun`
- DB: `money_mate` 데이터베이스 생성 및 `application.properties` 설정

---

## 3. 브랜치·커밋

- **기본 브랜치**: `main` (또는 프로젝트에서 지정한 기본 브랜치)
- **작업 브랜치**: `feature/기능명`, `fix/버그명` 등 의미 있는 이름 사용 권장
- **커밋 메시지**: 간단한 한 줄 요약 + 필요 시 본문에 상세 설명
  - 예: `feat: 정산 제안에 최소 금액 필터 추가`
  - 예: `fix: 예산 수정 시 날짜가 null로 초기화되는 문제 수정`

---

## 4. 코드 스타일

### 4.1 프론트엔드 (TypeScript/React)

- **포맷**: 프로젝트에 Prettier/ESLint 설정이 있으면 따릅니다.
- **컴포넌트**: 함수형 컴포넌트, PascalCase 파일명 (예: `BudgetList.tsx`).
- **API/유틸**: camelCase 파일명 (예: `expenseApi.ts`, `settlement.ts`).
- **타입**: 인터페이스/타입을 명시하고, `any` 사용을 최소화합니다.

### 4.2 백엔드 (Java)

- **패키지**: `com.example.money_mate_server` 하위 구조 유지.
- **네이밍**: 컨트롤러 메서드·서비스·매퍼 이름이 REST/도메인과 일치하도록 합니다.
- **예외**: 컨트롤러에서 적절한 HTTP 상태 코드 반환을 권장합니다.

---

## 5. 테스트

- **프론트**: `money-mate-client` 에서 `npm test` 실행. 새 기능/유틸에는 테스트 추가를 권장합니다.
- **백엔드**: `money-mate-server` 에서 `./gradlew test` 실행. 서비스·매퍼 단위 테스트 추가를 권장합니다.
- CI에서 위 명령이 통과하는지 확인합니다 (CI 설정이 있는 경우).

---

## 6. Pull Request

- **대상**: 기본 브랜치(예: `main`)를 기준으로 합니다.
- **내용**: 제목과 설명에 “무엇을/왜/어떻게” 변경했는지 적습니다.
- **연결**: 관련 이슈가 있으면 “Fixes #번호” 등으로 연결합니다.
- **리뷰**: 리뷰어 피드백에 따라 수정 후 머지합니다.
- **머지 후**: 로컬에서 기본 브랜치를 pull 받고, 사용한 feature 브랜치는 정리해도 됩니다.

---

## 7. 문서

- **API 변경**: [docs/API_SPECIFICATION.md](API_SPECIFICATION.md) 및 [docs/openapi.yaml](openapi.yaml) 업데이트를 권장합니다.
- **DB 변경**: [docs/DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) 및 DDL/마이그레이션 반영을 권장합니다.
- **아키텍처/동작 변경**: [docs/ARCHITECTURE.md](ARCHITECTURE.md) 및 필요 시 [docs/adr/](adr/) 에 ADR 추가를 권장합니다.

---

*문서 버전: 1.0 | MoneyMate Contributing*

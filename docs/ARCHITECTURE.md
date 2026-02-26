# MoneyMate 아키텍처 문서

이 문서는 MoneyMate 프로젝트의 전체 아키텍처, 레이어 구성, 기술 선택 이유를 정리합니다.

---

## 목차

1. [시스템 개요](#1-시스템-개요)
2. [전체 구조](#2-전체-구조)
3. [프론트엔드 아키텍처](#3-프론트엔드-아키텍처)
4. [백엔드 아키텍처](#4-백엔드-아키텍처)
5. [데이터 흐름](#5-데이터-흐름)
6. [기술 선택](#6-기술-선택)
7. [보안·CORS](#7-보안cors)
8. [확장 시 고려사항](#8-확장-시-고려사항)

---

## 1. 시스템 개요

MoneyMate는 **여행별 예산·지출·동행자·정산**을 관리하는 웹 애플리케이션입니다.

- **클라이언트**: SPA (Single Page Application), React 기반.
- **서버**: REST API, Spring Boot 기반.
- **저장소**: MySQL. MyBatis로 CRUD.

사용자 플로우 요약:

1. 메인에서 여행(카테고리) 선택 또는 새 여행 추가.
2. 카테고리 페이지에서 예산 설정, 동행자 등록, 지출 입력/수정/삭제.
3. 지출 합계와 인당 부담금을 바탕으로 정산 제안(누가 누구에게 얼마)을 표시.

---

## 2. 전체 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        사용자 (브라우저)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTP (JSON)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  money-mate-client (React SPA)                                   │
│  - React Router (/ , /category/:category)                         │
│  - Axios → API 호출                                               │
│  - 상태: useState, useEffect (서버 데이터 동기화)                  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ REST API (localhost:8080)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  money-mate-server (Spring Boot)                                 │
│  - Controller (REST) → Service → Mapper (MyBatis)                 │
│  - CORS: localhost:3000                                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ JDBC
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  MySQL (money_mate)                                              │
│  - expenses, budgets, travelers                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 프론트엔드 아키텍처

### 3.1 디렉터리 역할

- **pages/**: 라우트 단위 화면 (HomePage, JejuPage). URL과 1:1 대응.
- **components/**: 재사용 UI (BudgetList, ExpenseForm, ExpenseList, MButton 등).
- **api/**: 백엔드 호출 함수 (expenseApi, budgetApi, travelerApi). Axios 사용.
- **utils/**: 순수 로직 (예: settlement.ts 정산 제안 알고리즘).
- **전역 스타일**: index.css (CSS 변수, 폰트, 리셋).

### 3.2 상태 관리

- **전역 상태 라이브러리 없음**. 페이지/컴포넌트 단위 `useState` + `useEffect`로 서버 데이터 조회·갱신.
- **지속성**: 여행 카테고리 목록만 `localStorage` (`moneyMate_categories`)에 저장.

### 3.3 라우팅

- **React Router v7**: BrowserRouter, Routes, Route.
- **경로**:
  - `/` → HomePage
  - `/category/:category` → JejuPage (동적 세그먼트 = 여행 이름)

### 3.4 스타일

- CSS Modules 아님. 페이지/컴포넌트별 `.css` import.
- 테마: index.css의 `:root` CSS 변수 (색상, 그림자, radius 등)로 통일.

---

## 4. 백엔드 아키텍처

### 4.1 레이어 구성

- **Controller**: HTTP 요청/응답, DTO/엔티티 변환, Service 호출.
- **Service**: 비즈니스 로직, 트랜잭션 경계 (필요 시).
- **Mapper**: MyBatis 인터페이스. XML에서 SQL 정의.
- **Model/DTO**: Expense, Budget 등 엔티티; BudgetUpdateRequest, TravelerRequest 등 요청 DTO.

### 4.2 패키지 구조

```
controller/   → REST 엔드포인트
service/      → 비즈니스 로직
mapper/       → MyBatis Mapper 인터페이스
model/        → 엔티티 (Expense, Budget)
dto/          → 요청/응답 DTO
```

### 4.3 API 도메인

- **/expenses**: 지출 CRUD + 동행자 삭제 (DELETE /expenses/category/{id}).
- **/budget**: 예산 생성/조회/수정.
- **/category**: 동행자 추가/목록 조회.

---

## 5. 데이터 흐름

### 5.1 카테고리 페이지 진입 시

1. JejuPage 마운트 → `useParams().category` 획득.
2. `useEffect`에서 `getExpenses(category)`, `getBudgets(category)`, `getWhoExpenses(category)` 호출.
3. 응답으로 `expenses`, `budget`, `whoList` 상태 갱신.
4. BudgetList, ExpenseForm, ExpenseList, 정산 요약/정산 제안에 전달.

### 5.2 지출 추가 시

1. ExpenseForm 제출 → `onAdd(expense)` 호출.
2. JejuPage의 handleAddExpense → `addExpense(API)` 후 `getExpenses(category)`로 목록 재조회.
3. `setExpenses(updatedList)`, 필요 시 `setBudget(budget - amount)` 등.
4. 토스트 메시지 표시.

### 5.3 정산 제안 계산

1. `expenses`에서 지출자별 합계 `totalPerPerson` 계산.
2. `whoList`에서 참가자 이름 목록, 총 지출액 계산.
3. `getSettlementSuggestions(totalPerPerson, participantNames, totalSpent)` 호출 (utils/settlement.ts).
4. 반환된 단계 배열을 UI에 “A → B: N원” 형태로 표시.

---

## 6. 기술 선택

| 영역 | 선택 | 이유 |
|------|------|------|
| 프론트 | React 19 + TypeScript | 컴포넌트 재사용, 타입 안정성, 생태계 |
| 라우팅 | React Router 7 | SPA 표준, 동적 라우트 |
| UI | MUI 7 | 버튼·폼 등 빠른 구현, 테마 가능 |
| HTTP | Axios | 인터셉터, Promise 기반 |
| 백엔드 | Spring Boot 3 | REST API, 설정 간소화 |
| DB 접근 | MyBatis | SQL 제어, XML 매퍼로 가독성 |
| DB | MySQL | 관계형, 운영 친숙함 |

---

## 7. 보안·CORS

- **인증**: 현재 없음 (개발용). 추후 JWT/세션 도입 시 Controller/필터에서 검증 필요.
- **CORS**: 서버에서 `http://localhost:3000` 허용. 프로덕션은 배포 Origin으로 제한 권장.
- **입력 검증**: 필수 필드·타입은 Controller/DTO에서 검증 강화 권장.

---

## 8. 확장 시 고려사항

- **다중 사용자**: 사용자/세션 도입 시 expenses, budgets, travelers에 user_id 등 소유자 컬럼 추가.
- **정산 알고리즘**: settlement.ts를 서버로 이전해 재사용·캐싱 가능.
- **오프라인/캐시**: Service Worker, 로컬 캐시 전략 검토.
- **테스트**: 단위(유틸·서비스)·통합(API)·E2E(클라이언트) 보강.

---

*문서 버전: 1.0 | MoneyMate Architecture*

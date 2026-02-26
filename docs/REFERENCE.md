# MoneyMate 참조 문서

프로젝트 내 모든 주요 파일·API·데이터 구조를 한 곳에서 참조할 수 있도록 정리한 문서입니다.

---

## 1. 프론트엔드 파일 참조

### 1.1 진입점·라우팅

| 파일 | 설명 |
|------|------|
| `src/index.tsx` | React 앱 진입점. ReactDOM.render, App 마운트. |
| `src/App.tsx` | BrowserRouter, Routes, Route. `/` → HomePage, `/category/:category` → JejuPage. |
| `src/index.css` | 전역 스타일. :root CSS 변수(색상, 그림자, radius), body, button/input 리셋. |

### 1.2 페이지

| 파일 | 설명 |
|------|------|
| `src/pages/HomePage.tsx` | 메인. 오늘 날짜, 제목, "다른 여행 추가" 버튼, 카테고리 카드 목록. localStorage 복원. |
| `src/pages/HomePage.css` | HomePage 전용 스타일. 그라데이션 배경, 카드, 모달, 버튼. |
| `src/pages/JejuPage.tsx` | 카테고리별 지출 관리. 예산·동행자·지출 폼/목록·정산 요약·정산 제안. API 연동. |
| `src/pages/JejuPage.css` | JejuPage 전용 스타일. 헤더, 섹션, 토스트, 정산 카드. |
| `src/pages/CategoryPage.tsx` | (현재 라우팅에 미연결. 필요 시 사용.) |

### 1.3 컴포넌트

| 파일 | 설명 |
|------|------|
| `src/components/BudgetList.tsx` | 예산 표시/수정. 진행률 바, 예산·남은 예산, 날짜 입력, 저장/취소/예산 수정 버튼. |
| `src/components/BudgetList.css` | BudgetList 스타일. |
| `src/components/ExpenseForm.tsx` | 지출 추가 폼. 항목·금액·지출자, 빠른 금액 버튼, (선택) 엑셀 업로드. |
| `src/components/ExpenseForm.css` | ExpenseForm 스타일. |
| `src/components/ExpenseList.tsx` | 지출 목록. 카드 형태, 수정/삭제 버튼, 수정 모달, 빈 상태 UI. |
| `src/components/ExpenseList.css` | ExpenseList 스타일. |
| `src/components/common/MButton.tsx` | 공통 버튼. variant: BACK, PRIMARY, CATEGORY 등. MUI Button + sx. |
| `src/components/etc.tsx` | 유틸(예: checkFileChange 엑셀 업로드). |

### 1.4 API 클라이언트

| 파일 | 설명 |
|------|------|
| `src/api/expenseApi.ts` | addExpense, getExpenses, updateExpense, deleteExpenses, deleteName. Axios, API_BASE_URL. |
| `src/api/budgetApi.ts` | createBudget, getBudgets, updateBudget. Axios, API_BASE_URL. |
| `src/api/travelerApi.ts` | whoExpenses, getWhoExpenses. Axios, API_BASE_URL. |

### 1.5 유틸·타입·상수

| 파일 | 설명 |
|------|------|
| `src/utils/settlement.ts` | getSettlementSuggestions(totalPerPerson, participantNames, totalSpent). 정산 제안 알고리즘. |
| `src/types/index.ts` | Expense, ExpenseRequest, Budget, BudgetResponse, Traveler, TravelerRequest, SettlementStep, CategoryItem, ApiError. |
| `src/constants/index.ts` | API_BASE_URL, EXPENSES_PATH, BUDGET_PATH, CATEGORY_PATH, STORAGE_KEY_CATEGORIES, ROUTES, TOAST_DURATION_MS, SETTLEMENT_MIN_DIFF. |

---

## 2. 백엔드 파일 참조

### 2.1 컨트롤러

| 파일 | 설명 |
|------|------|
| `controller/ExpenseController.java` | /expenses. GET(목록), POST(추가), PUT /{id}(수정), DELETE /{id}(지출 삭제), DELETE /category/{id}(동행자 삭제). |
| `controller/BudgetController.java` | /budget. POST(생성), GET /{category}(조회), PUT /{category}(수정). |
| `controller/TravelerController.java` | /category. POST(동행자 추가), GET?category=(목록 조회). |

### 2.2 서비스

| 파일 | 설명 |
|------|------|
| `service/ExpenseService.java` | getAllExpenses, getExpensesByCategory, saveExpense, updateExpense, deleteExpense, deleteName. ExpenseMapper 위임. |
| `service/BudgetService.java` | saveBudget(기존 있으면 update, 없으면 insert), getBudgetByCategory. BudgetMapper 위임. |
| `service/TravelerService.java` | saveTravelerName, getTravelerNamesByCategory. TravelerMapper 위임. |

### 2.3 매퍼 (MyBatis)

| 파일 | 설명 |
|------|------|
| `mapper/ExpenseMapper.java` | getAllExpenses, getExpensesByCategory, insertExpense, updateExpense, deleteExpense, deleteName. |
| `mapper/BudgetMapper.java` | insertBudget, updateBudget, getBudgetByCategory. |
| `mapper/TravelerMapper.java` | saveName, findNamesByCategory. |
| `resources/mybatis/mapper/ExpenseMapper.xml` | 위 Mapper에 대응하는 SQL. |
| `resources/mybatis/mapper/BudgetMapper.xml` | 위 Mapper에 대응하는 SQL. |
| `resources/mybatis/mapper/TravelerMapper.xml` | 위 Mapper에 대응하는 SQL. |

### 2.4 모델·DTO

| 파일 | 설명 |
|------|------|
| `model/Expense.java` | id, category, title, amount, payer. |
| `model/Budget.java` | id, category, totalAmount, startDate, endDate. |
| `dto/BudgetUpdateRequest.java` | inputAmount, startDate, endDate. |
| `dto/TravelerRequest.java` | name, category. |
| `dto/TravelerDto.java` | id, name. |

---

## 3. API 엔드포인트 요약

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /expenses?category= | 카테고리별 지출 목록 (category 생략 시 전체) |
| POST | /expenses | 지출 추가 |
| PUT | /expenses/{id} | 지출 수정 |
| DELETE | /expenses/{id} | 지출 삭제 |
| DELETE | /expenses/category/{id} | 동행자 삭제 |
| POST | /budget | 예산 생성 |
| GET | /budget/{category} | 카테고리별 예산 조회 |
| PUT | /budget/{category} | 예산 수정 |
| POST | /category | 동행자 추가 |
| GET | /category?category= | 카테고리별 동행자 목록 |

---

## 4. 데이터베이스 테이블 요약

| 테이블 | 설명 |
|--------|------|
| expenses | id, category, title, amount, payer |
| budgets | id, category, total_amount, start_date, end_date |
| travelers | id, category, name |

---

## 5. 문서 목록

| 문서 | 설명 |
|------|------|
| README.md | 프로젝트 개요, 구조, 기능, 실행 방법, 기술 스택. |
| docs/PROJECT_OVERVIEW.md | 전체 분석. 구조, API, 데이터 흐름, 주요 파일. |
| docs/API_SPECIFICATION.md | API 상세 명세. |
| docs/API_EXAMPLES.md | curl·JSON 예시. |
| docs/openapi.yaml | OpenAPI 3.0 스펙. |
| docs/ARCHITECTURE.md | 아키텍처, 레이어, 기술 선택. |
| docs/DATABASE_SCHEMA.md | DB 스키마, DDL, 인덱스. |
| docs/USER_GUIDE.md | 사용자 가이드. |
| docs/DEVELOPER_GUIDE.md | 개발자 가이드. |
| docs/DEPLOYMENT.md | 배포 가이드. |
| docs/TROUBLESHOOTING.md | 트러블슈팅. |
| docs/CONTRIBUTING.md | 기여 가이드. |
| docs/CHANGELOG.md | 버전별 변경 사항. |
| docs/GLOSSARY.md | 용어 사전. |
| docs/DETAILED_FLOWS.md | 상세 플로우. |
| docs/adr/001-stack-choices.md | ADR: 기술 스택. |
| docs/adr/002-no-global-state.md | ADR: 전역 상태 미도입. |
| docs/adr/003-settlement-on-client.md | ADR: 정산 제안 클라이언트 구현. |

---

*문서 버전: 1.0 | MoneyMate Reference*

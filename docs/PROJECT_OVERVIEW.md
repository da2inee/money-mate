# MoneyMate 프로젝트 전체 분석

여행별 예산·지출·동행자·정산을 관리하는 풀스택 웹 앱입니다.

---

## 1. 프로젝트 구조

```
MoneyMate/
├── money-mate-client/          # 프론트엔드 (React + TypeScript)
│   └── src/
│       ├── App.tsx             # 라우팅
│       ├── index.css           # 전역 스타일·CSS 변수
│       ├── pages/              # HomePage, JejuPage, CategoryPage
│       ├── components/         # BudgetList, ExpenseForm, ExpenseList, MButton, etc
│       ├── api/                # expenseApi, budgetApi, travelerApi
│       └── utils/              # settlement (정산 제안 계산)
│
├── money-mate-server/          # 백엔드 (Spring Boot + MyBatis)
│   └── src/main/
│       ├── java/.../money_mate_server/
│       │   ├── controller/     # Expense, Budget, Traveler REST API
│       │   ├── service/        # 비즈니스 로직
│       │   ├── mapper/          # MyBatis 인터페이스
│       │   ├── model/           # Expense, Budget 엔티티
│       │   └── dto/             # BudgetUpdateRequest, TravelerRequest 등
│       └── resources/
│           ├── application.properties
│           └── mybatis/mapper/*.xml
│
└── docs/
    └── PROJECT_OVERVIEW.md     # 이 문서
```

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| **프론트** | React 19, TypeScript, React Router 7, MUI 7, Axios |
| **백엔드** | Spring Boot 3.4, Java 21 |
| **DB 접근** | MyBatis 3.0 |
| **DB** | MySQL (money_mate, localhost:3306) |

---

## 3. 라우팅 (클라이언트)

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | HomePage | 메인: 오늘 날짜, 여행 카테고리 선택(제주/서울/유럽 + 사용자 추가), "다른 여행 추가" |
| `/category/:category` | JejuPage | 해당 여행의 예산·동행자·지출·정산 관리 |

- **카테고리** = 여행 이름(예: `jeju`, `seoul`, `유럽 여행`). 사용자 추가 여행은 `localStorage` 키 `moneyMate_categories`에 저장.

---

## 4. API 정리 (백엔드 ↔ 클라이언트)

### 4.1 지출 (Expense)

| 메서드 | 경로 | 설명 | 클라이언트 함수 |
|--------|------|------|-----------------|
| GET | `/expenses?category={category}` | 카테고리별 지출 목록 | `getExpenses(category)` |
| GET | `/expenses` | 전체 지출 | `getExpenses()` |
| POST | `/expenses` | 지출 추가 | `addExpense(expense)` |
| PUT | `/expenses/{id}` | 지출 수정 | `updateExpense(id, expense)` |
| DELETE | `/expenses/{id}` | 지출 삭제 | `deleteExpenses(id)` |
| DELETE | `/expenses/category/{id}` | 동행자(이름) 삭제 | `deleteName(id)` |

- **Body (POST/PUT)**: `{ category, title, amount, payer }`
- **Response**: `{ id, category, title, amount, payer }`

### 4.2 예산 (Budget)

| 메서드 | 경로 | 설명 | 클라이언트 함수 |
|--------|------|------|-----------------|
| POST | `/budget` | 예산 생성 | `createBudget({ category, totalAmount, startDate?, endDate? })` |
| GET | `/budget/{category}` | 카테고리별 예산 조회 | `getBudgets(category)` |
| PUT | `/budget/{category}` | 예산 수정 | `updateBudget(category, inputAmount, startDate?, endDate?)` |

- **GET 응답**: `{ totalAmount, startDate?, endDate? }` (또는 Budget 엔티티 필드)
- **PUT Body**: `BudgetUpdateRequest` → `{ inputAmount, startDate, endDate }`

### 4.3 동행자 (Traveler / Category)

| 메서드 | 경로 | 설명 | 클라이언트 함수 |
|--------|------|------|-----------------|
| POST | `/category` | 동행자 추가 | `whoExpenses(category, name)` |
| GET | `/category?category={category}` | 카테고리별 동행자 목록 | `getWhoExpenses(category)` |

- **POST Body**: `{ name, category }`
- **Response (GET)**: `[{ id, name }, ...]`

---

## 5. 데이터 흐름 요약

1. **메인(HomePage)**  
   - 기본 카테고리(제주/서울/유럽) + `localStorage`의 사용자 추가 여행 표시.  
   - 카드 클릭 → `/category/:category` 이동.  
   - "다른 여행 추가" → 모달에서 이름 입력 → `customList` + localStorage 갱신 → 해당 `/category/:id`로 이동.

2. **카테고리 페이지(JejuPage)**  
   - `category`(URL 파라미터) 기준으로:
     - 지출 목록: `getExpenses(category)`
     - 예산: `getBudgets(category)`
     - 동행자: `getWhoExpenses(category)`
   - 지출 추가 → `addExpense` → 목록 재조회.  
   - 동행자 추가 → `whoExpenses` → `getWhoExpenses`로 목록 갱신.  
   - 동행자 삭제 → `deleteName(id)` (DELETE `/expenses/category/{id}`).  
   - 지출 합계로 **인당 사용액** 계산 → `getSettlementSuggestions()`로 **정산 제안**(누가 누구에게 얼마) 계산.

3. **정산 제안(settlement.ts)**  
   - 참가자별 1인당 평균 부담금 계산.  
   - 부족한 사람(debtor) → 많이 낸 사람(creditor)에게 송금하는 단계 배열로 반환.  
   - 10원 미만 차이는 무시.

---

## 6. 주요 파일 역할

### 클라이언트

| 파일 | 역할 |
|------|------|
| `App.tsx` | Router, `/`, `/category/:category` 라우팅 |
| `pages/HomePage.tsx` | 메인 UI, 카테고리 카드, 새 여행 추가 모달 |
| `pages/JejuPage.tsx` | 예산·동행자·지출 폼/목록·정산 요약/정산 제안, API 연동 |
| `components/BudgetList.tsx` | 예산 표시/수정, 진행률 바, 날짜(시작/종료) |
| `components/ExpenseForm.tsx` | 지출 항목·금액·지출자 입력, 빠른 금액 버튼, (선택) 엑셀 업로드 |
| `components/ExpenseList.tsx` | 지출 목록, 수정/삭제, 수정 모달 |
| `components/common/MButton.tsx` | 공통 버튼 (BACK, PRIMARY 등 variant) |
| `api/expenseApi.ts` | 지출 CRUD + 동행자 삭제 |
| `api/budgetApi.ts` | 예산 생성/조회/수정 |
| `api/travelerApi.ts` | 동행자 추가/목록 조회 |
| `utils/settlement.ts` | 정산 제안 알고리즘 |

### 서버

| 파일 | 역할 |
|------|------|
| `controller/ExpenseController.java` | 지출 CRUD + 동행자 삭제 엔드포인트 |
| `controller/BudgetController.java` | 예산 생성/조회/수정 |
| `controller/TravelerController.java` | 동행자 추가/목록 조회 |
| `service/ExpenseService.java` | 지출·동행자 삭제 비즈니스 로직 |
| `service/BudgetService.java` | 예산 저장/조회 |
| `service/TravelerService.java` | 동행자 저장/카테고리별 조회 |
| `model/Expense.java` | 지출 엔티티 (id, category, title, amount, payer) |
| `model/Budget.java` | 예산 엔티티 (id, category, totalAmount, startDate, endDate) |
| `resources/application.properties` | DB(MySQL), MyBatis 매퍼 경로 등 |

---

## 7. DB·설정

- **MySQL**: `jdbc:mysql://localhost:3306/money_mate`  
- **MyBatis**: `classpath:mybatis/mapper/*.xml`  
- **CORS**: 백엔드에서 `http://localhost:3000` 허용.  
- **클라이언트 API 베이스**: `http://localhost:8080`

---

## 8. 실행 방법

**백엔드 (JDK 21, MySQL 준비)**  
```bash
cd money-mate-server && ./gradlew bootRun
```
→ API: http://localhost:8080

**프론트엔드**  
```bash
cd money-mate-client && npm install && npm start
```
→ 앱: http://localhost:3000

---

## 9. 기타

- **CategoryPage.tsx**: 라우팅에는 없음. 필요 시 라우트에 연결해 사용 가능.  
- **etc.tsx**: 엑셀 업로드 등 유틸(예: `checkFileChange`) 제공.  
- **동행자 삭제**: API는 지출 컨트롤러의 `DELETE /expenses/category/{id}` 사용 (동행자 테이블/엔티티 id).

이 문서는 프로젝트 전체 분석을 한 번에 보기 위한 요약입니다. 세부 구현은 각 파일 주석과 코드를 참고하면 됩니다.

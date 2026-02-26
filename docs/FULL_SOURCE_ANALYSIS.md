# MoneyMate 전체 소스 분석 (단일 문서)

전체 프로젝트 소스를 분석해 **하나의 문서**로 정리한 요약입니다.

---

## 1. 프로젝트 요약

| 항목 | 내용 |
|------|------|
| **이름** | MoneyMate |
| **역할** | 여행별 예산·지출·동행자 관리 + "누가 누구에게 얼마" 정산 제안 |
| **구성** | 프론트(React SPA) + 백엔드(REST API) + MySQL |
| **화면 수** | 2개 (메인, 지출 관리) |
| **실행** | 서버 8080 → 클라이언트 3000 |

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트 | React 19, TypeScript, React Router 7, MUI 7, Axios |
| 백엔드 | Spring Boot 3.4, Java 21 |
| DB 접근 | MyBatis 3.0 (XML 매퍼) |
| DB | MySQL 8 (DB명: money_mate) |

---

## 3. 디렉터리·파일 구조

```
MoneyMate/
├── money-mate-client/
│   └── src/
│       ├── index.tsx              # React 진입점, App 마운트
│       ├── index.css              # 전역 스타일·CSS 변수
│       ├── App.tsx                # 라우팅: / → HomePage, /category/:category → JejuPage
│       ├── pages/
│       │   ├── HomePage.tsx       # 메인: 날짜·제목·여행 카드·다른 여행 추가 모달
│       │   ├── HomePage.css
│       │   ├── JejuPage.tsx       # 지출 관리: 예산·동행자·지출·정산 요약/제안
│       │   └── JejuPage.css
│       ├── components/
│       │   ├── BudgetList.tsx     # 예산 표시/수정, 진행률 바, 날짜
│       │   ├── BudgetList.css
│       │   ├── ExpenseForm.tsx    # 지출 추가 폼(항목·금액·지출자·빠른금액·엑셀)
│       │   ├── ExpenseForm.css
│       │   ├── ExpenseList.tsx    # 지출 목록·수정 모달·삭제
│       │   ├── ExpenseList.css
│       │   ├── common/MButton.tsx  # 공통 버튼(BACK, PRIMARY 등)
│       │   └── etc.tsx            # checkFileChange(엑셀 업로드) 등
│       ├── api/
│       │   ├── expenseApi.ts      # 지출 CRUD + 동행자 삭제(deleteName)
│       │   ├── budgetApi.ts       # 예산 생성/조회/수정
│       │   └── travelerApi.ts     # 동행자 추가/목록 조회
│       ├── utils/
│       │   └── settlement.ts      # getSettlementSuggestions (정산 제안 알고리즘)
│       ├── types/index.ts         # 공통 타입
│       └── constants/index.ts     # API URL, 라우트, localStorage 키
│
├── money-mate-server/
│   └── src/main/
│       ├── java/.../money_mate_server/
│       │   ├── controller/
│       │   │   ├── ExpenseController.java   # /expenses
│       │   │   ├── BudgetController.java     # /budget
│       │   │   └── TravelerController.java   # /category
│       │   ├── service/
│       │   │   ├── ExpenseService.java
│       │   │   ├── BudgetService.java
│       │   │   └── TravelerService.java
│       │   ├── mapper/
│       │   │   ├── ExpenseMapper.java
│       │   │   ├── BudgetMapper.java
│       │   │   └── TravelerMapper.java
│       │   ├── model/
│       │   │   ├── Expense.java   # id, category, title, amount, payer
│       │   │   └── Budget.java    # id, category, totalAmount, startDate, endDate
│       │   └── dto/
│       │       ├── BudgetUpdateRequest.java  # inputAmount, startDate, endDate
│       │       ├── TravelerRequest.java     # name, category
│       │       └── TravelerDto.java         # id, name
│       └── resources/
│           ├── application.properties      # DB URL, MyBatis 경로
│           └── mybatis/mapper/
│               ├── ExpenseMapper.xml
│               ├── BudgetMapper.xml
│               └── TravelerMapper.xml
```

---

## 4. 프론트엔드 소스 요약

### 4.1 진입·라우팅

- **index.tsx**: `ReactDOM.createRoot` → `App` 렌더, `index.css` 로드.
- **App.tsx**: `BrowserRouter` + `Routes`.  
  - `path="/"` → `HomePage`  
  - `path="/category/:category"` → `JejuPage`

### 4.2 HomePage (메인)

- **상태**: `customList`(localStorage 복원), `modalOpen`, `newTripName`.
- **기본 카테고리**: 제주(jeju), 서울(seoul), 유럽 여행 — id/label/icon/color 고정.
- **동작**  
  - 카드 클릭 → `navigate('/category/' + encodeURIComponent(id))`.  
  - "다른 여행 추가" → 모달 열림 → 이름 입력 후 `customList` + `localStorage.setItem('moneyMate_categories', ...)` → `navigate('/category/' + id)`.

### 4.3 JejuPage (지출 관리)

- **URL**: `useParams().category` (예: jeju).
- **상태**: `expenses`, `budget`, `startDate`, `endDate`, `totalSpent`, `goWith`, `whoList`, `toastMessage`.
- **마운트 시** (`useEffect`, dependency `[category]`):  
  `getExpenses(category)`, `getBudgets(category)`, `getWhoExpenses(category)` 호출 → 각각 setExpenses, setBudget/setStartDate/setEndDate, setWhoList.
- **지출 추가**: `handleAddExpense` → `addExpense` → `getExpenses` 재조회 → setExpenses, setToastMessage. (선택) setBudget(budget - amount).
- **동행자 추가**: `handleName` → `whoExpenses` → `getWhoExpenses` → setWhoList, setGoWith('').
- **동행자 삭제**: `handleDelete` → confirm → `deleteName(id)` → `getWhoExpenses` → setWhoList.
- **정산**: `getTotalPerPerson(expenses)` → 이름별 합계. `getSettlementSuggestions(totalPerPerson, participantNames, totalSpent)` → "A → B: N원" 리스트. participantNames = whoList.map(w => w.name).

### 4.4 BudgetList

- **props**: category, budget, setBudget, totalSpent, startDate, endDate.
- **상태**: isEditing, inputAmount, inputStartDate, inputEndDate, savedToast.
- **로직**: budget === 0이면 편집 모드. 저장 시 createBudget 또는 updateBudget → getBudgets → setBudget, setIsEditing(false), 1.2초 후 location.reload().
- **표시**: 예산 사용률 바(spendPercent), 90% 이상이면 over 스타일. 남은 예산(remain).

### 4.5 ExpenseForm

- **props**: onAdd(expense: { title, amount, payer }).
- **상태**: title, amount, payer, excelFileName.
- **제출**: onAdd({ title, amount: Number(amount), payer }) 후 입력 초기화. 빠른 금액 버튼(1만/2만/5만/10만). 엑셀 업로드는 checkFileChange(etc.tsx) 연동.

### 4.6 ExpenseList

- **props**: expenses, onDelete(목록 재조회 콜백), budget, setTotalSpent.
- **동작**: total = sum(expenses.amount), setTotalSpent(total) 호출. 수정 시 모달 → updateExpense → onDelete(). 삭제 시 deleteExpenses(id) → onDelete().
- **빈 목록**: "아직 지출이 없어요" 등 빈 상태 UI.

### 4.7 API (api/*.ts)

- **expenseApi**: BASE `http://localhost:8080`.  
  getExpenses(category?), addExpense(body), updateExpense(id, body), deleteExpenses(id), deleteName(id).
- **budgetApi**: BASE `http://localhost:8080/budget`.  
  createBudget(body), getBudgets(category), updateBudget(category, inputAmount, startDate?, endDate?).
- **travelerApi**: BASE `http://localhost:8080/category`.  
  whoExpenses(category, name) → POST body { name, category }. getWhoExpenses(category) → GET ?category=.

### 4.8 정산 알고리즘 (utils/settlement.ts)

- **입력**: totalPerPerson(이름→총액), participantNames, totalSpent.
- **로직**: participants = participantNames.length ? participantNames : keys(totalPerPerson). average = floor(totalSpent / participants.length). balance = (totalPerPerson[name] || 0) - average. debtors(balance < -10), creditors(balance > 10). 그리디로 debtor→creditor 송금 단계 생성, 10원 미만은 무시.
- **출력**: SettlementStep[] { from, to, amount }.

---

## 5. 백엔드 소스 요약

### 5.1 Controller

- **ExpenseController** (`/expenses`)  
  - GET ?category= → getExpensesByCategory 또는 getAllExpenses.  
  - POST body Expense → saveExpense.  
  - PUT /{id} body Expense → updateExpense.  
  - DELETE /{id} → deleteExpense.  
  - DELETE /category/{id} → deleteName (travelers 테이블 삭제).
- **BudgetController** (`/budget`)  
  - POST body Budget → saveBudget.  
  - GET /{category} → getBudgetByCategory.  
  - PUT /{category} body BudgetUpdateRequest → Budget 세팅 후 saveBudget.
- **TravelerController** (`/category`)  
  - POST body TravelerRequest → saveTravelerName.  
  - GET ?category= → getTravelerNamesByCategory.

### 5.2 Service

- **ExpenseService**: Mapper 호출만 (getAllExpenses, getExpensesByCategory, insertExpense, updateExpense, deleteExpense, deleteName).
- **BudgetService**: getBudgetByCategory로 기존 예산 있으면 updateBudget, 없으면 insertBudget.
- **TravelerService**: saveName(name, category), findNamesByCategory(category).

### 5.3 Mapper (인터페이스)

- **ExpenseMapper**: getAllExpenses, getExpensesByCategory, insertExpense(useGeneratedKeys), updateExpense, deleteExpense(id), deleteName(id).
- **BudgetMapper**: insertBudget, updateBudget, getBudgetByCategory.
- **TravelerMapper**: saveName(name, category), findNamesByCategory(category) → TravelerDto 리스트.

### 5.4 Model / DTO

- **Expense**: id(Long), category, title, amount(double), payer.
- **Budget**: id(Long), category, totalAmount(int), startDate(LocalDate), endDate(LocalDate).
- **BudgetUpdateRequest**: inputAmount(int), startDate, endDate(LocalDate).
- **TravelerRequest**: name, category.
- **TravelerDto**: id(Long), name (생성자 2개 인자).

### 5.5 MyBatis XML

- **ExpenseMapper.xml**: expenses 테이블 SELECT/INSERT/UPDATE/DELETE. deleteName은 `DELETE FROM travelers WHERE id = #{id}`.
- **BudgetMapper.xml**: budgets 테이블 INSERT, UPDATE BY category, SELECT BY category. 컬럼 total_amount, start_date, end_date.
- **TravelerMapper.xml**: travelers INSERT (saveName), SELECT id,name BY category (findNamesByCategory).

### 5.6 설정 (application.properties)

- spring.datasource: url=jdbc:mysql://localhost:3306/money_mate, username=root, password=, driver=com.mysql.cj.jdbc.Driver.
- mybatis.mapper-locations=classpath:mybatis/mapper/*.xml, type-aliases-package=model 패키지.

---

## 6. DB 테이블 (소스 기준)

| 테이블 | 컬럼 | 비고 |
|--------|------|------|
| expenses | id, category, title, amount, payer | 지출 1건당 1행 |
| budgets | id, category, total_amount, start_date, end_date | 카테고리당 1행(upsert) |
| travelers | id, category, name | 동행자 1명당 1행 |

---

## 7. API ↔ 클라이언트·서버 매핑

| HTTP | 경로 | 컨트롤러 메서드 | 서비스 | 클라이언트 함수 |
|------|------|-----------------|--------|-----------------|
| GET | /expenses?category= | getExpenses | getExpensesByCategory | getExpenses(category) |
| POST | /expenses | createExpense | saveExpense | addExpense |
| PUT | /expenses/{id} | updateExpense | updateExpense | updateExpense(id, body) |
| DELETE | /expenses/{id} | deleteExpense | deleteExpense | deleteExpenses(id) |
| DELETE | /expenses/category/{id} | deleteName | deleteName | deleteName(id) |
| POST | /budget | createBudget | saveBudget | createBudget |
| GET | /budget/{category} | getBudgetByCategory | getBudgetByCategory | getBudgets(category) |
| PUT | /budget/{category} | updateBudget | saveBudget | updateBudget(category, ...) |
| POST | /category | createTraveler | saveTravelerName | whoExpenses(category, name) |
| GET | /category?category= | getTravelerNames | getTravelerNamesByCategory | getWhoExpenses(category) |

---

## 8. 데이터 흐름 요약

1. **메인**  
   사용자 카드 클릭 → URL `/category/:category` → JejuPage 마운트.

2. **JejuPage 마운트**  
   getExpenses(category) → setExpenses.  
   getBudgets(category) → setBudget, setStartDate, setEndDate.  
   getWhoExpenses(category) → setWhoList.

3. **지출 추가**  
   ExpenseForm 제출 → handleAddExpense → addExpense(API) → getExpenses → setExpenses, setToastMessage.

4. **정산 표시**  
   expenses → getTotalPerPerson → totalPerPerson.  
   getSettlementSuggestions(totalPerPerson, whoList 이름들, totalSpent) → settlementSteps 렌더.

5. **동행자**  
   추가: whoExpenses → getWhoExpenses → setWhoList.  
   삭제: deleteName(id) → getWhoExpenses → setWhoList.

6. **예산**  
   BudgetList 저장: createBudget/updateBudget → getBudgets → setBudget → (선택) reload.

---

## 9. 한 페이지 치트시트

- **프론트 진입**: index.tsx → App.tsx → Route에 따라 HomePage / JejuPage.
- **메인**: HomePage — 카드 클릭 시 `/category/:id` 이동, "다른 여행 추가"는 localStorage + navigate.
- **지출 관리**: JejuPage — category로 지출·예산·동행자 API 호출 후 BudgetList, ExpenseForm, ExpenseList, 정산 요약/제안 표시.
- **정산 계산**: settlement.ts의 getSettlementSuggestions(이름별 합계, 참가자 목록, 총액).
- **백엔드**: Controller → Service → Mapper(MyBatis) → MySQL (expenses, budgets, travelers).
- **실행**: 서버 `./gradlew bootRun` (8080), 클라이언트 `npm start` (3000). DB money_mate 필요.

---

*이 문서는 저장소 전체 소스를 분석해 하나로 요약한 것입니다. 상세 API·DB는 API_SPECIFICATION.md, DATABASE_SCHEMA.md를 참고하세요.*

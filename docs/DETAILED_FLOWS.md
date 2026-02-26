# MoneyMate 상세 플로우

사용자 동작과 시스템 반응을 단계별로 정리합니다.

---

## 목차

1. [메인 화면 진입](#1-메인-화면-진입)
2. [여행 선택 후 지출 관리 페이지 진입](#2-여행-선택-후-지출-관리-페이지-진입)
3. [예산 설정](#3-예산-설정)
4. [동행자 등록](#4-동행자-등록)
5. [지출 추가](#5-지출-추가)
6. [지출 수정·삭제](#6-지출-수정삭제)
7. [정산 요약·정산 제안 확인](#7-정산-요약정산-제안-확인)
8. [다른 여행 추가](#8-다른-여행-추가)
9. [뒤로가기](#9-뒤로가기)

---

## 1. 메인 화면 진입

1. 사용자가 브라우저에서 `http://localhost:3000` (또는 배포 URL)에 접속합니다.
2. React Router가 경로 `/` 를 처리하고 HomePage를 렌더링합니다.
3. HomePage는 다음을 표시합니다.
   - 오늘 날짜 (JavaScript `new Date()` 로 계산)
   - "여행" 뱃지
   - "어디로 떠날까요?" 제목
   - "예산을 챙길 여행을 골라보세요" 부제
   - "다른 여행 추가" 버튼
   - "여행 선택" 라벨
   - 기본 카테고리 카드: 제주, 서울, 유럽 여행
   - localStorage에서 복원한 사용자 추가 여행 카드 (있는 경우)
4. 사용자는 카드를 클릭해 해당 여행 페이지로 이동하거나, "다른 여행 추가"를 눌러 새 여행을 추가할 수 있습니다.

---

## 2. 여행 선택 후 지출 관리 페이지 진입

1. 사용자가 "제주" 카드를 클릭합니다.
2. React Router의 `navigate(\`/category/jeju\`)` 가 호출되어 URL이 `/category/jeju` 로 바뀝니다.
3. JejuPage가 마운트되고 `useParams().category` 로 "jeju"를 얻습니다.
4. `useEffect` 안에서 다음 API가 호출됩니다.
   - `getExpenses("jeju")` → GET /expenses?category=jeju
   - `getBudgets("jeju")` → GET /budget/jeju
   - `getWhoExpenses("jeju")` → GET /category?category=jeju
5. 응답으로 `expenses`, `budget`, `whoList` 상태가 갱신되고, BudgetList·동행자 섹션·ExpenseForm·ExpenseList·정산 요약·정산 제안이 해당 데이터로 렌더링됩니다.
6. 헤더에는 "뒤로가기" 버튼과 "JEJU 여행 지출 관리" 제목이 표시됩니다.

---

## 3. 예산 설정

1. JejuPage의 BudgetList 영역에서 "예산 수정" 또는 처음 진입 시 예산 입력 폼이 보입니다.
2. **처음 예산 설정 시**
   - 사용자가 "예산 금액" 입력란에 숫자(예: 500000)를 입력합니다.
   - (선택) 여행 시작일·종료일을 date 입력란에 입력합니다.
   - "저장" 버튼을 누릅니다.
   - BudgetList의 handleSave가 호출되고, createBudget API (POST /budget)가 호출됩니다.
   - 성공 시 getBudgets(category)로 다시 조회하고 setBudget로 상태를 갱신합니다. setIsEditing(false)로 보기 모드로 전환됩니다.
   - "예산이 저장됐어요" 토스트가 표시되고, 일부 구현에서는 window.location.reload()로 페이지가 새로고침됩니다.
3. **이미 예산이 있을 때**
   - 예산 진행률 바와 "예산: N원", "남은 예산: M원"이 표시됩니다.
   - "예산 수정" 버튼을 누르면 isEditing이 true가 되어 입력 폼이 다시 나타납니다.
   - 금액·날짜를 수정한 뒤 "저장"을 누르면 updateBudget API (PUT /budget/:category)가 호출되고, 위와 같이 상태가 갱신됩니다.
   - "취소"를 누르면 isEditing이 false가 되어 수정 없이 보기 모드로 돌아갑니다.

---

## 4. 동행자 등록

1. JejuPage의 "같이 간 사람" 섹션에 입력란과 "추가" 버튼이 있습니다.
2. 사용자가 이름(예: "홍길동")을 입력하고 "추가" 버튼을 누릅니다.
3. handleName(goWith, category)가 호출됩니다.
   - whoExpenses(category, name) → POST /category { name, category }
   - 성공 시 getWhoExpenses(category)로 목록을 다시 조회하고 setWhoList로 갱신합니다.
   - setGoWith("")로 입력란을 비웁니다.
4. "함께한 멤버" 목록에 새 이름이 추가됩니다.
5. **동행자 삭제**
   - 목록 각 항목의 "삭제" 버튼을 누르면 window.confirm 확인 후 deleteName(id) → DELETE /expenses/category/:id 가 호출됩니다.
   - getWhoExpenses(category)로 목록을 다시 조회하고 setWhoList로 갱신합니다.

---

## 5. 지출 추가

1. ExpenseForm에 "지출 항목", "금액 (원)", "지출자" 입력란과 "추가" 버튼이 있습니다.
2. 사용자가 항목명(예: "맛집"), 금액(예: 35000), 지출자(예: "홍길동")를 입력합니다.
   - "빠른 금액" 버튼(1만, 2만, 5만, 10만)을 누르면 해당 금액이 금액란에 채워질 수 있습니다.
3. "추가" 버튼(또는 폼 제출)을 누릅니다.
4. ExpenseForm의 handleSubmit이 호출되고 onAdd({ title, amount, payer })가 호출됩니다.
5. JejuPage의 handleAddExpense가 실행됩니다.
   - addExpense(completeExpense) → POST /expenses
   - getExpenses(category)로 목록을 다시 조회하고 setExpenses(updatedList)로 갱신합니다.
   - setToastMessage("지출이 추가됐어요")로 토스트를 띄웁니다.
   - (선택) budget이 있으면 setBudget(budget - amount)로 남은 예산을 갱신할 수 있습니다.
6. ExpenseList에 새 지출 행이 나타나고, 정산 요약·정산 제안이 다시 계산되어 표시됩니다.

---

## 6. 지출 수정·삭제

1. **수정**
   - ExpenseList 각 항목의 "수정" 버튼을 누르면 openEdit(expense)가 호출되고, 수정 모달이 열립니다.
   - 사용자가 항목·금액·지출자를 바꾼 뒤 "저장"을 누르면 handleSaveEdit이 호출됩니다.
   - updateExpense(editing.id, { ... }) → PUT /expenses/:id
   - onDelete()는 부모에서 getExpenses(category)로 목록을 다시 조회하는 콜백이므로, 목록이 갱신됩니다. 모달이 닫힙니다.
2. **삭제**
   - "삭제" 버튼을 누르면 window.confirm 확인 후 handleDelete(id)가 호출됩니다.
   - deleteExpenses(id) → DELETE /expenses/:id
   - onDelete()로 목록을 다시 조회하고 setExpenses로 갱신합니다.

---

## 7. 정산 요약·정산 제안 확인

1. **정산 요약 (개인 사용 금액)**
   - JejuPage에서 expenses를 기반으로 getTotalPerPerson(expenses)가 계산됩니다.
   - totalPerPerson 객체(이름 → 총액)가 "개인 사용 금액" 목록으로 렌더링됩니다.
2. **정산 제안**
   - getSettlementSuggestions(totalPerPerson, participantNames, totalSpent)가 호출됩니다.
   - participantNames는 whoList.map(w => w.name)입니다.
   - totalSpent는 Object.values(totalPerPerson).reduce((a,b)=>a+b,0)입니다.
   - 반환된 settlementSteps 배열이 "정산 제안" 섹션에 "A → B: N원" 형태로 표시됩니다.
3. 지출을 추가·수정·삭제할 때마다 위 계산이 다시 수행되므로, 화면에 즉시 반영됩니다.

---

## 8. 다른 여행 추가

1. 메인(HomePage)에서 "다른 여행 추가" 버튼을 누릅니다.
2. openModal()이 호출되어 모달이 열리고, 여행 이름 입력란이 포커스됩니다.
3. 사용자가 이름(예: "부산")을 입력하고 "추가하기" 버튼을 누릅니다.
4. submitNewTrip이 호출됩니다.
   - newItem = { id: name, label: name, icon: '🧳', color: 'card-teal' } 로 새 카테고리 항목을 만듭니다.
   - setCustomList([...customList, newItem])로 상태를 갱신합니다.
   - localStorage.setItem('moneyMate_categories', JSON.stringify(next))로 저장합니다.
   - closeModal() 후 navigate(\`/category/${encodeURIComponent(name)}\`)로 해당 여행 페이지로 이동합니다.
5. JejuPage가 해당 category(예: "부산")로 마운트되고, 위 "2. 여행 선택 후 지출 관리 페이지 진입"과 동일하게 API가 호출되어 빈 목록·예산 없음 상태로 표시됩니다.

---

## 9. 뒤로가기

1. JejuPage 헤더의 "뒤로가기" 버튼(MButton variant="BACK")을 누릅니다.
2. navigate(-1)이 호출되어 브라우저 히스토리에서 이전 페이지(보통 메인)로 이동합니다.
3. HomePage가 다시 렌더링되고, localStorage에 저장된 카테고리 목록이 그대로 표시됩니다.

---

*문서 버전: 1.0 | MoneyMate Detailed Flows*

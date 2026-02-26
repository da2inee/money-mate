# MoneyMate 용어 사전

프로젝트 내에서 사용하는 용어와 약어를 정리합니다.

---

## A

**API**  
Application Programming Interface. MoneyMate에서는 백엔드가 제공하는 REST API(지출·예산·동행자)를 의미합니다.

**Axios**  
HTTP 클라이언트 라이브러리. 프론트엔드에서 API 호출에 사용합니다.

---

## B

**Backend**  
서버 측 애플리케이션. MoneyMate에서는 Spring Boot 기반 REST API 서버를 의미합니다.

**Budget**  
예산. 여행(카테고리)별로 설정하는 총 예산 금액과, 선택적으로 여행 시작일·종료일을 가집니다.

**BudgetList**  
예산을 표시·수정하는 프론트엔드 컴포넌트. 예산 진행률 바, 남은 예산, 예산 수정 폼을 포함합니다.

---

## C

**Category**  
여행을 구분하는 이름. 예: jeju, seoul, 유럽 여행. URL 경로 `/category/:category` 에서 사용됩니다.

**CORS**  
Cross-Origin Resource Sharing. 브라우저에서 다른 Origin(예: localhost:3000 → localhost:8080)으로 API 요청을 할 때 서버가 허용해야 합니다. 백엔드에서 `@CrossOrigin` 으로 설정합니다.

**Create React App (CRA)**  
React 프로젝트를 생성·실행하는 도구. `react-scripts` 로 빌드·테스트를 수행합니다.

---

## D

**DDL**  
Data Definition Language. 데이터베이스 테이블 생성·수정·삭제용 SQL. `docs/DATABASE_SCHEMA.md` 에 예시가 있습니다.

**DTO**  
Data Transfer Object. API 요청/응답이나 레이어 간 데이터 전달에 쓰는 객체. 예: BudgetUpdateRequest, TravelerRequest, TravelerDto.

---

## E

**Expense**  
지출 한 건. 항목명(title), 금액(amount), 지출자(payer), 카테고리(category)를 가집니다.

**ExpenseForm**  
지출을 추가하는 폼 컴포넌트. 항목·금액·지출자 입력, 빠른 금액 버튼, (선택) 엑셀 업로드 필드를 포함합니다.

**ExpenseList**  
지출 목록을 표시하는 컴포넌트. 수정·삭제 버튼과 수정 모달을 포함합니다.

---

## F

**Frontend**  
클라이언트 측 애플리케이션. MoneyMate에서는 React SPA를 의미합니다.

---

## G

**getSettlementSuggestions**  
정산 제안을 계산하는 함수. `utils/settlement.ts` 에 정의되어 있으며, 지출자별 합계·참가자 목록·총 지출액을 입력받아 "누가 누구에게 얼마" 단계 배열을 반환합니다.

**Gradle**  
백엔드 빌드 도구. `./gradlew build`, `./gradlew bootRun` 등으로 사용합니다.

---

## H

**HomePage**  
메인 화면. 오늘 날짜, 제목, "다른 여행 추가" 버튼, 여행 카테고리 카드 목록을 표시합니다.

---

## I

**id**  
지출·예산·동행자 레코드의 고유 식별자. DB에서 AUTO_INCREMENT 등으로 부여됩니다.

---

## J

**JejuPage**  
카테고리(여행)별 지출 관리 페이지. URL `/category/:category` 에 대응하며, 예산·동행자·지출 폼/목록·정산 요약·정산 제안을 표시합니다.

**JAR**  
Java Archive. Spring Boot 빌드 결과물. `java -jar ...jar` 로 실행합니다.

**JUnit**  
Java 단위·통합 테스트 프레임워크. 백엔드 서비스·컨트롤러 테스트에 사용됩니다.

---

## L

**localStorage**  
브라우저에 키-값 형태로 데이터를 저장하는 Web API. MoneyMate에서는 사용자가 추가한 여행 카테고리 목록(`moneyMate_categories`)을 저장하는 데 사용합니다.

---

## M

**Mapper**  
MyBatis에서 SQL과 Java 메서드를 연결하는 인터페이스. 예: ExpenseMapper, BudgetMapper, TravelerMapper.

**MoneyMate**  
프로젝트 이름. 여행별 예산·지출·동행자·정산을 관리하는 웹 앱입니다.

**MUI**  
Material-UI. React용 UI 컴포넌트 라이브러리. MoneyMate에서는 MButton, Typography, FormControl 등 일부 컴포넌트에 사용합니다.

**MyBatis**  
Java용 SQL 매퍼 프레임워크. XML에 SQL을 작성하고 Mapper 인터페이스와 연결합니다.

**MySQL**  
관계형 데이터베이스. MoneyMate 백엔드의 저장소로 사용됩니다.

---

## N

**Node.js**  
JavaScript 런타임. 프론트엔드 개발 서버(npm start)와 빌드(npm run build)에 사용됩니다.

**npm**  
Node.js 패키지 매니저. `npm install`, `npm start`, `npm test` 등으로 사용합니다.

---

## P

**Payer**  
지출자. 해당 지출을 결제한 사람의 이름. 정산 제안 계산 시 "누가 얼마를 냈는지" 구분에 사용됩니다.

**PR**  
Pull Request. 저장소에 변경 사항을 반영하기 위한 요청. CONTRIBUTING.md 에 절차가 정리되어 있습니다.

---

## R

**React**  
UI 라이브러리. MoneyMate 프론트엔드는 React 19 + TypeScript로 작성됩니다.

**React Router**  
클라이언트 사이드 라우팅 라이브러리. BrowserRouter, Routes, Route로 `/` 와 `/category/:category` 를 처리합니다.

**REST**  
Representational State Transfer. HTTP 메서드(GET, POST, PUT, DELETE)와 리소스 경로로 API를 설계하는 방식. MoneyMate 백엔드 API는 REST 스타일입니다.

---

## S

**Settlement**  
정산. "누가 누구에게 얼마를 주면 되는지" 계산·표시하는 기능. `utils/settlement.ts` 의 getSettlementSuggestions 함수가 핵심 로직입니다.

**SettlementStep**  
정산 제안의 한 단계. from(보내는 사람), to(받는 사람), amount(금액)를 가집니다.

**SPA**  
Single Page Application. 한 페이지에서 JavaScript로 화면을 전환하는 웹 앱. MoneyMate 프론트엔드는 SPA입니다.

**Spring Boot**  
Java 기반 웹 애플리케이션 프레임워크. MoneyMate 백엔드는 Spring Boot 3.4 + Java 21을 사용합니다.

---

## T

**Traveler**  
동행자. "같이 간 사람" 목록에 등록된 이름. travelers 테이블에 category와 name으로 저장됩니다.

**TypeScript**  
JavaScript에 타입을 더한 언어. 프론트엔드 코드는 TypeScript로 작성됩니다.

---

## U

**useEffect**  
React 훅. 마운트 시 API 호출 등 부수 효과를 수행할 때 사용합니다. JejuPage에서 지출·예산·동행자 조회에 사용됩니다.

**useState**  
React 훅. 컴포넌트 내부 상태를 관리할 때 사용합니다.

---

## V

**Variant**  
MButton 컴포넌트에서 버튼 스타일 종류. BACK, PRIMARY, CATEGORY 등이 있습니다.

---

## W

**whoList**  
JejuPage에서 "같이 간 사람" 목록 상태. getWhoExpenses API로 조회하고, whoExpenses로 추가, deleteName으로 삭제합니다.

---

## X

**XML Mapper**  
MyBatis에서 SQL을 작성하는 XML 파일. `resources/mybatis/mapper/*.xml` 에 위치합니다.

---

*문서 버전: 1.0 | MoneyMate Glossary*

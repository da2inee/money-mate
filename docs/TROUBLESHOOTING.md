# MoneyMate 트러블슈팅

자주 발생하는 문제와 해결 방법을 정리합니다.

---

## 목차

1. [프론트엔드](#1-프론트엔드)
2. [백엔드](#2-백엔드)
3. [데이터베이스](#3-데이터베이스)
4. [API·네트워크](#4-apinetwork)
5. [빌드·실행](#5-빌드실행)
6. [기타](#6-기타)

---

## 1. 프론트엔드

### 1.1 npm start 시 포트가 이미 사용 중

**증상**: `Something is already running on port 3000` 또는 EADDRINUSE

**해결**:
- 다른 터미널에서 이미 `npm start`가 떠 있으면 중복 실행이므로 하나만 둡니다.
- 3000 포트를 쓰는 다른 프로세스를 종료합니다.
  - macOS/Linux: `lsof -i :3000` 후 해당 PID로 `kill <PID>`
  - Windows: netstat로 프로세스 확인 후 종료
- 또는 다른 포트로 실행: `PORT=3001 npm start` (환경에 따라 다름)

---

### 1.2 화면이 하얗거나 "Cannot GET /" 만 보임

**증상**: localhost:3000 접속 시 빈 화면 또는 Cannot GET /

**해결**:
- React 앱이 SPA이므로 서버가 반드시 `index.html`을 fallback 해야 합니다. `npm start`(개발 서버)를 쓰면 자동 처리됩니다.
- 배포 환경에서는 Nginx 등에서 `try_files $uri /index.html` 설정을 확인합니다.
- 브라우저 콘솔(F12)에 JavaScript 오류가 있는지 확인합니다.

---

### 1.3 API 호출 실패 (Network Error / CORS)

**증상**: 지출·예산·동행자 조회/추가 시 네트워크 오류 또는 CORS 에러

**해결**:
- 백엔드 서버가 **http://localhost:8080** 에서 떠 있는지 확인합니다.
- `api/expenseApi.ts`, `budgetApi.ts`, `travelerApi.ts` 의 API 베이스 URL이 실제 서버 주소와 일치하는지 확인합니다.
- CORS 에러인 경우: 백엔드에서 `@CrossOrigin(origins = "http://localhost:3000")` 또는 프로덕션 도메인이 허용되어 있는지 확인합니다.
- 방화벽/보안 소프트웨어가 localhost 연결을 막고 있지 않은지 확인합니다.

---

### 1.4 지출/예산이 안 불러와져요

**증상**: 카테고리 페이지에 들어갔는데 목록이 비어 있거나 예산이 0으로만 보임

**해결**:
- URL의 `:category` 값이 서버에 저장된 category와 동일한지 확인합니다 (대소문자, 공백, 인코딩).
- 브라우저 Network 탭에서 GET /expenses?category=..., GET /budget/... 요청이 200으로 오는지, 응답 본문에 데이터가 있는지 확인합니다.
- 서버/DB에 해당 카테고리로 데이터가 실제로 있는지 DB에서 확인합니다.

---

### 1.5 추가한 여행(카테고리)이 다음에 안 보여요

**증상**: "다른 여행 추가"로 만든 여행이 새로고침 후 사라짐

**해결**:
- 추가한 여행 목록은 **localStorage** 키 `moneyMate_categories`에 저장됩니다.
- 시크릿 모드, 다른 브라우저, 다른 기기에서는 공유되지 않습니다.
- localStorage를 지우면 목록이 사라집니다. 개발자 도구 → Application → Local Storage에서 확인할 수 있습니다.

---

## 2. 백엔드

### 2.1 bootRun 시 포트 8080 이미 사용 중

**증상**: `Port 8080 was already in use` 또는 BindException

**해결**:
- 이미 다른 Spring Boot 또는 서비스가 8080을 쓰고 있으면 종료하거나, 포트를 변경합니다.
- 포트 변경: `application.properties` 에 `server.port=8081` 등 추가.
- macOS/Linux: `lsof -i :8080` 후 해당 프로세스 종료.

---

### 2.2 DB 연결 실패 (Communications link failure)

**증상**: 애플리케이션 기동 시 DB 연결 오류

**해결**:
- MySQL 서버가 실행 중인지 확인합니다.
- `application.properties` 의 `spring.datasource.url`, `username`, `password`가 맞는지 확인합니다.
- URL에 DB 이름이 포함되어 있는지 확인합니다 (예: `jdbc:mysql://localhost:3306/money_mate`).
- 방화벽이 3306 포트를 막고 있지 않은지 확인합니다.
- MySQL 8에서는 `allowPublicKeyRetrieval=true` 등이 필요할 수 있으므로 URL 옵션을 확인합니다.

---

### 2.3 테이블/컬럼이 없다는 오류

**증상**: `Table 'money_mate.expenses' doesn't exist` 등

**해결**:
- `docs/DATABASE_SCHEMA.md` 의 DDL로 테이블을 생성합니다.
- JPA `ddl-auto=update`를 쓰는 경우, 엔티티와 DB가 일치하는지 확인합니다.
- MyBatis만 쓰는 경우 테이블은 수동 생성이 필요합니다.

---

### 2.4 예산 조회 시 500 에러 또는 null

**증상**: GET /budget/{category} 호출 시 500 또는 null 반환

**해결**:
- 해당 카테고리에 예산 행이 없을 수 있습니다. BudgetService/BudgetMapper에서 “없을 때” 처리가 어떻게 되는지 확인합니다 (빈 객체 반환 또는 예외).
- category 값에 특수문자/공백이 있으면 인코딩 또는 쿼리 바인딩을 확인합니다.

---

## 3. 데이터베이스

### 3.1 MySQL 접속이 안 돼요

**해결**:
- MySQL 서비스가 실행 중인지 확인합니다.
- 사용자 권한: 해당 사용자가 `money_mate` DB에 접근 권한이 있는지 확인합니다.
- `mysql -u root -p` 등으로 로그인 테스트 후, `USE money_mate;` 로 DB 선택 가능한지 확인합니다.

---

### 3.2 데이터가 이상해요 (중복, 누락)

**해결**:
- 지출/예산/동행자 테이블을 직접 조회해 봅니다: `SELECT * FROM expenses;` 등.
- 프론트에서 “저장 후 목록 재조회”를 하지 않으면 화면에 반영되지 않을 수 있습니다. JejuPage 등에서 addExpense 후 getExpenses를 다시 호출하는지 확인합니다.
- 동행자 삭제는 DELETE /expenses/category/{id} 로 travelers 테이블의 id를 삭제하는지 매퍼를 확인합니다.

---

## 4. API·네트워크

### 4.1 404 Not Found

**해결**:
- 요청 URL과 백엔드 경로가 일치하는지 확인합니다 (대소문자, trailing slash, path variable).
- `docs/API_SPECIFICATION.md` 또는 `docs/openapi.yaml` 과 실제 Controller 경로를 비교합니다.

---

### 4.2 400 Bad Request

**해결**:
- POST/PUT 시 Body가 JSON이고, 필수 필드(category, title, amount, payer 등)가 포함되어 있는지 확인합니다.
- Content-Type: application/json 인지 확인합니다.
- 숫자 필드(amount, totalAmount 등)에 문자열이 들어가 있지 않은지 확인합니다.

---

### 4.3 500 Internal Server Error

**해결**:
- 서버 로그를 확인합니다. 스택 트레이스로 예외 원인을 파악합니다.
- DB 연결, SQL 문법, NULL 처리, 타입 불일치 등을 의심합니다.
- 로깅 레벨을 DEBUG로 올려 상세 로그를 확인합니다.

---

## 5. 빌드·실행

### 5.1 npm run build 실패 (프론트)

**증상**: TypeScript/ESLint 오류로 빌드 중단

**해결**:
- 터미널에 나온 파일·라인으로 오류를 수정합니다.
- `npm run build` 전에 `npm test` 를 실행해 단위 테스트가 통과하는지 확인합니다.
- node_modules 문제가 의심되면 `rm -rf node_modules package-lock.json && npm install` 후 다시 빌드합니다.

---

### 5.2 ./gradlew build 실패 (백엔드)

**증상**: 컴파일 오류 또는 테스트 실패

**해결**:
- Java 버전이 21인지 확인합니다: `java -version`, `javac -version`.
- 오류 메시지에 나온 Java 파일을 수정합니다.
- 테스트가 실패한 경우: `./gradlew test` 로 어떤 테스트가 실패했는지 확인하고, DB 등 테스트 환경을 점검합니다.
- MyBatis 매퍼 XML 문법 오류가 있으면 XML 로그를 확인합니다.

---

### 5.3 JAR 실행 시 오류

**해결**:
- `java -jar ...jar` 실행 시 DB URL 등 설정이 JAR 외부(환경 변수 또는 application.properties)로 전달되는지 확인합니다.
- `SPRING_PROFILES_ACTIVE=prod` 등 프로파일을 지정해 프로덕션 설정이 로드되도록 합니다.

---

## 6. 기타

### 6.1 정산 제안이 비어 있어요

**해결**:
- 지출이 하나도 없거나, 참가자(동행자)가 없으면 빈 배열이 나올 수 있습니다.
- “같이 간 사람”을 등록하고, 지출 입력 시 “지출자”를 올바르게 넣었는지 확인합니다.
- `utils/settlement.ts` 의 로직상 10원 미만 차이는 무시됩니다. 금액이 균등하면 단계가 없을 수 있습니다.

---

### 6.2 예산 진행률이 100% 넘어가요

**해결**:
- UI에서 진행률은 `Math.min(100, (totalSpent / budget) * 100)` 등으로 상한을 두고 있을 수 있습니다. 예산을 초과해도 100%로 표시되도록 되어 있을 수 있습니다.
- “남은 예산”이 마이너스로 나오면 예산 대비 지출이 초과된 상태입니다. 예산을 늘리거나 지출을 수정/삭제합니다.

---

### 6.3 문서/문서 버전

- 각 문서 하단에 “문서 버전”을 두어 변경 이력을 추적할 수 있습니다.
- API·DB·아키텍처 변경 시 해당 문서를 함께 수정합니다.

---

*문서 버전: 1.0 | MoneyMate 트러블슈팅*

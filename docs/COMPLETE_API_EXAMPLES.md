# MoneyMate API 전체 예시 모음

모든 엔드포인트에 대한 요청/응답 예시를 시나리오별로 정리한 문서입니다.  
베이스 URL: `http://localhost:8080`

---

## 1. 지출 API (Expenses) 예시

### 1.1 GET /expenses?category=jeju — 카테고리별 조회 (데이터 있음)

**요청**

```http
GET /expenses?category=jeju HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**응답 (200 OK)**

```json
[
  {
    "id": 1,
    "category": "jeju",
    "title": "맛집",
    "amount": 35000,
    "payer": "홍길동"
  },
  {
    "id": 2,
    "category": "jeju",
    "title": "렌트카",
    "amount": 120000,
    "payer": "김철수"
  }
]
```

---

### 1.2 GET /expenses?category=seoul — 카테고리별 조회 (빈 목록)

**요청**

```http
GET /expenses?category=seoul HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**응답 (200 OK)**

```json
[]
```

---

### 1.3 GET /expenses — 전체 지출 조회

**요청**

```http
GET /expenses HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**응답 (200 OK)**

- 모든 카테고리의 지출이 하나의 배열로 반환됩니다. 형식은 1.1과 동일합니다.

---

### 1.4 POST /expenses — 지출 추가 (정상)

**요청**

```http
POST /expenses HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Accept: application/json

{
  "category": "jeju",
  "title": "교통비",
  "amount": 25000,
  "payer": "이영희"
}
```

**응답 (200 OK)**

```json
{
  "id": 3,
  "category": "jeju",
  "title": "교통비",
  "amount": 25000,
  "payer": "이영희"
}
```

---

### 1.5 POST /expenses — 지출 추가 (다른 카테고리)

**요청**

```http
POST /expenses HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "category": "유럽 여행",
  "title": "호텔",
  "amount": 150000,
  "payer": "홍길동"
}
```

**응답 (200 OK)**

- 저장된 지출 객체가 id와 함께 반환됩니다. category는 "유럽 여행"입니다.

---

### 1.6 PUT /expenses/3 — 지출 수정

**요청**

```http
PUT /expenses/3 HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "category": "jeju",
  "title": "택시비",
  "amount": 30000,
  "payer": "이영희"
}
```

**응답 (200 OK)**

- 수정된 지출 객체가 그대로 반환됩니다.

---

### 1.7 DELETE /expenses/3 — 지출 삭제

**요청**

```http
DELETE /expenses/3 HTTP/1.1
Host: localhost:8080
```

**응답 (204 No Content)**

- 본문 없음.

---

### 1.8 DELETE /expenses/category/1 — 동행자 삭제

**요청**

```http
DELETE /expenses/category/1 HTTP/1.1
Host: localhost:8080
```

**응답 (204 No Content)**

- 본문 없음. travelers 테이블에서 id=1 레코드가 삭제됩니다.

---

## 2. 예산 API (Budget) 예시

### 2.1 POST /budget — 예산 생성 (날짜 포함)

**요청**

```http
POST /budget HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "category": "jeju",
  "totalAmount": 500000,
  "startDate": "2025-03-01",
  "endDate": "2025-03-05"
}
```

**응답 (200 OK)**

```json
{
  "id": 1,
  "category": "jeju",
  "totalAmount": 500000,
  "startDate": "2025-03-01",
  "endDate": "2025-03-05"
}
```

---

### 2.2 POST /budget — 예산 생성 (날짜 없음)

**요청**

```http
POST /budget HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "category": "seoul",
  "totalAmount": 300000
}
```

**응답 (200 OK)**

- startDate, endDate는 null일 수 있습니다. 구현에 따릅니다.

---

### 2.3 GET /budget/jeju — 예산 조회

**요청**

```http
GET /budget/jeju HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**응답 (200 OK)**

```json
{
  "id": 1,
  "category": "jeju",
  "totalAmount": 500000,
  "startDate": "2025-03-01",
  "endDate": "2025-03-05"
}
```

---

### 2.4 PUT /budget/jeju — 예산 수정

**요청**

```http
PUT /budget/jeju HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "inputAmount": 600000,
  "startDate": "2025-03-01",
  "endDate": "2025-03-07"
}
```

**응답 (200 OK)**

- 본문: "예산 업데이트 완료" 등 문자열 (구현에 따름).

---

## 3. 동행자 API (Category) 예시

### 3.1 POST /category — 동행자 추가

**요청**

```http
POST /category HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "name": "홍길동",
  "category": "jeju"
}
```

**응답 (200 OK)**

- 본문: 저장된 이름 문자열 등 (구현에 따름).

---

### 3.2 GET /category?category=jeju — 동행자 목록 조회

**요청**

```http
GET /category?category=jeju HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**응답 (200 OK)**

```json
[
  { "id": 1, "name": "홍길동" },
  { "id": 2, "name": "김철수" }
]
```

---

## 4. 에러·경계 시나리오

### 4.1 POST /expenses — 필수 필드 누락

**요청 (amount, payer 누락)**

```http
POST /expenses HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "category": "jeju",
  "title": "맛집"
}
```

**가능한 응답**

- 400 Bad Request 또는 500 Internal Server Error (구현에 따름).
- 서버에서 필수 필드 검증을 하면 400을 반환하는 것이 권장됩니다.

---

### 4.2 GET /budget/unknown — 존재하지 않는 카테고리

**요청**

```http
GET /budget/unknown HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**가능한 응답**

- 200 OK + null 본문 또는 500 (구현에 따름).
- BudgetService.getBudgetByCategory가 null을 반환하면 Controller에서 500 또는 별도 처리 가능합니다.

---

*문서 버전: 1.0 | MoneyMate Complete API Examples*

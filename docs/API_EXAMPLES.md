# MoneyMate API 요청/응답 예시

실제 호출 예시와 예상 응답을 curl 및 JSON으로 정리합니다.  
베이스 URL: `http://localhost:8080`

---

## 1. 지출 (Expenses)

### 1.1 카테고리별 지출 목록 조회

```bash
curl -X GET "http://localhost:8080/expenses?category=jeju"
```

**응답 예시 (200 OK)**

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

### 1.2 전체 지출 목록 조회

```bash
curl -X GET "http://localhost:8080/expenses"
```

**응답 예시 (200 OK)**

- 형식은 위와 동일 (배열). 모든 카테고리의 지출이 포함됩니다.

---

### 1.3 지출 추가

```bash
curl -X POST "http://localhost:8080/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "jeju",
    "title": "교통비",
    "amount": 25000,
    "payer": "이영희"
  }'
```

**응답 예시 (200 OK)**

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

### 1.4 지출 수정

```bash
curl -X PUT "http://localhost:8080/expenses/3" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "jeju",
    "title": "택시비",
    "amount": 30000,
    "payer": "이영희"
  }'
```

**응답 예시 (200 OK)**

- 수정된 지출 객체가 그대로 반환됩니다.

---

### 1.5 지출 삭제

```bash
curl -X DELETE "http://localhost:8080/expenses/3"
```

**응답**: 204 No Content (본문 없음)

---

### 1.6 동행자 삭제

```bash
curl -X DELETE "http://localhost:8080/expenses/category/1"
```

**응답**: 204 No Content (본문 없음)

---

## 2. 예산 (Budget)

### 2.1 예산 생성

```bash
curl -X POST "http://localhost:8080/budget" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "jeju",
    "totalAmount": 500000,
    "startDate": "2025-03-01",
    "endDate": "2025-03-05"
  }'
```

**응답 예시 (200 OK)**

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

### 2.2 카테고리별 예산 조회

```bash
curl -X GET "http://localhost:8080/budget/jeju"
```

**응답 예시 (200 OK)**

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

### 2.3 예산 수정

```bash
curl -X PUT "http://localhost:8080/budget/jeju" \
  -H "Content-Type: application/json" \
  -d '{
    "inputAmount": 600000,
    "startDate": "2025-03-01",
    "endDate": "2025-03-07"
  }'
```

**응답 예시 (200 OK)**

- 본문: `"예산 업데이트 완료"` 등 문자열 (구현에 따름)

---

## 3. 동행자 (Category / Traveler)

### 3.1 동행자 추가

```bash
curl -X POST "http://localhost:8080/category" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "category": "jeju"
  }'
```

**응답 예시 (200 OK)**

- 본문: 저장된 이름 문자열 등 (구현에 따름)

---

### 3.2 카테고리별 동행자 목록 조회

```bash
curl -X GET "http://localhost:8080/category?category=jeju"
```

**응답 예시 (200 OK)**

```json
[
  { "id": 1, "name": "홍길동" },
  { "id": 2, "name": "김철수" }
]
```

---

## 4. 에러 시나리오

### 4.1 필수 필드 누락 (400 Bad Request 가능)

```bash
curl -X POST "http://localhost:8080/expenses" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "jeju",
    "title": "맛집"
  }'
```

- amount, payer가 없으면 서버에 따라 400 또는 500이 반환될 수 있습니다.

### 4.2 존재하지 않는 리소스 (404/500)

- GET /budget/unknown_category → 예산이 없으면 500 또는 null 반환 (구현에 따름)
- DELETE /expenses/99999 → 해당 id가 없으면 204 또는 404 (구현에 따름)

---

*문서 버전: 1.0 | MoneyMate API Examples*

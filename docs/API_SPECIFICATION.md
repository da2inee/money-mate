# MoneyMate API 명세서

이 문서는 MoneyMate 백엔드 REST API의 상세 명세입니다.  
베이스 URL: `http://localhost:8080` (개발 환경)

---

## 목차

1. [공통 사항](#1-공통-사항)
2. [지출 API (Expenses)](#2-지출-api-expenses)
3. [예산 API (Budget)](#3-예산-api-budget)
4. [동행자 API (Category/Traveler)](#4-동행자-api-categorytraveler)
5. [에러 응답](#5-에러-응답)
6. [CORS](#6-cors)

---

## 1. 공통 사항

### 1.1 요청 형식

- **Content-Type**: `application/json` (POST, PUT)
- **Accept**: `application/json`

### 1.2 인증

- 현재 버전: 인증 없음 (개발용)
- 추후 JWT 또는 세션 기반 인증 도입 가능

### 1.3 응답 코드

| 코드 | 의미 |
|------|------|
| 200 | 성공 (GET, PUT, POST 일부) |
| 204 | 성공·본문 없음 (DELETE) |
| 400 | 잘못된 요청 |
| 404 | 리소스 없음 |
| 500 | 서버 내부 오류 |

---

## 2. 지출 API (Expenses)

### 2.1 카테고리별 지출 목록 조회

**요청**

```
GET /expenses?category={category}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| category | string | 아니오 | 여행 카테고리(예: jeju, seoul). 생략 시 전체 조회 |

**응답** `200 OK`

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

**필드 설명**

| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 지출 고유 ID |
| category | string | 여행(카테고리) 이름 |
| title | string | 지출 항목명 |
| amount | number | 금액 (원) |
| payer | string | 지출자(결제한 사람) 이름 |

---

### 2.2 전체 지출 목록 조회

**요청**

```
GET /expenses
```

쿼리 파라미터 없이 호출 시 모든 카테고리의 지출을 반환합니다.

**응답** `200 OK`

- 형식은 2.1과 동일 (배열)

---

### 2.3 지출 추가

**요청**

```
POST /expenses
Content-Type: application/json
```

**Body**

```json
{
  "category": "jeju",
  "title": "교통비",
  "amount": 25000,
  "payer": "이영희"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| category | string | 예 | 여행(카테고리) |
| title | string | 예 | 지출 항목명 |
| amount | number | 예 | 금액 (원) |
| payer | string | 예 | 지출자 이름 |

**응답** `200 OK`

- 저장된 지출 객체 반환 (id 포함)

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

### 2.4 지출 수정

**요청**

```
PUT /expenses/{id}
Content-Type: application/json
```

| 경로 파라미터 | 타입 | 설명 |
|---------------|------|------|
| id | number | 수정할 지출 ID |

**Body**

- 2.3과 동일 (category, title, amount, payer)
- 서버에서 path의 id로 엔티티 식별

**응답** `200 OK`

- 수정된 지출 객체

---

### 2.5 지출 삭제

**요청**

```
DELETE /expenses/{id}
```

| 경로 파라미터 | 타입 | 설명 |
|---------------|------|------|
| id | number | 삭제할 지출 ID |

**응답** `204 No Content`

- 본문 없음

---

### 2.6 동행자(이름) 삭제

**요청**

```
DELETE /expenses/category/{id}
```

| 경로 파라미터 | 타입 | 설명 |
|---------------|------|------|
| id | number | 삭제할 동행자(이름) 레코드 ID |

**설명**

- 동행자(Traveler) 목록에서 해당 id의 레코드를 삭제합니다.
- 엔드포인트 경로는 지출(expenses) 하위에 있으나, 실제로는 동행자 테이블/엔티티를 삭제합니다.

**응답** `204 No Content`

---

## 3. 예산 API (Budget)

### 3.1 예산 생성

**요청**

```
POST /budget
Content-Type: application/json
```

**Body**

```json
{
  "category": "jeju",
  "totalAmount": 500000,
  "startDate": "2025-03-01",
  "endDate": "2025-03-05"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| category | string | 예 | 여행(카테고리) |
| totalAmount | number | 예 | 총 예산 금액 (원) |
| startDate | string | 아니오 | 여행 시작일 (YYYY-MM-DD) |
| endDate | string | 아니오 | 여행 종료일 (YYYY-MM-DD) |

**응답** `200 OK`

- 저장된 예산 객체 (id, category, totalAmount, startDate, endDate)

---

### 3.2 카테고리별 예산 조회

**요청**

```
GET /budget/{category}
```

| 경로 파라미터 | 타입 | 설명 |
|---------------|------|------|
| category | string | 여행(카테고리) 이름 |

**응답** `200 OK`

```json
{
  "id": 1,
  "category": "jeju",
  "totalAmount": 500000,
  "startDate": "2025-03-01",
  "endDate": "2025-03-05"
}
```

- 해당 카테고리에 예산이 없으면 500 등 오류 가능 (구현에 따름)

---

### 3.3 예산 수정

**요청**

```
PUT /budget/{category}
Content-Type: application/json
```

| 경로 파라미터 | 타입 | 설명 |
|---------------|------|------|
| category | string | 여행(카테고리) |

**Body**

```json
{
  "inputAmount": 600000,
  "startDate": "2025-03-01",
  "endDate": "2025-03-07"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| inputAmount | number | 예 | 새 총 예산 금액 |
| startDate | string | 아니오 | 여행 시작일 |
| endDate | string | 아니오 | 여행 종료일 |

**응답** `200 OK`

- 본문: `"예산 업데이트 완료"` 등 문자열 (구현에 따름)

---

## 4. 동행자 API (Category/Traveler)

### 4.1 동행자 추가

**요청**

```
POST /category
Content-Type: application/json
```

**Body**

```json
{
  "name": "홍길동",
  "category": "jeju"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | 예 | 동행자 이름 |
| category | string | 예 | 여행(카테고리) |

**응답** `200 OK`

- 본문: 저장된 이름 문자열 등 (구현에 따름)

---

### 4.2 카테고리별 동행자 목록 조회

**요청**

```
GET /category?category={category}
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| category | string | 예 | 여행(카테고리) |

**응답** `200 OK`

```json
[
  { "id": 1, "name": "홍길동" },
  { "id": 2, "name": "김철수" }
]
```

---

## 5. 에러 응답

- 4xx/5xx 시 본문 형식은 구현에 따라 다를 수 있음.
- 예: `{ "message": "에러 메시지", "code": "ERROR_CODE" }`

---

## 6. CORS

- 개발 환경: `http://localhost:3000` Origin 허용.
- 프로덕션: 배포 도메인에 맞게 CORS 설정 필요.

---

*문서 버전: 1.0 | MoneyMate Backend API*

# MoneyMate 데이터베이스 스키마

이 문서는 MoneyMate 백엔드에서 사용하는 MySQL 데이터베이스의 테이블 구조와 관계를 설명합니다.

---

## 목차

1. [개요](#1-개요)
2. [테이블 목록](#2-테이블-목록)
3. [테이블 상세](#3-테이블-상세)
4. [ER 관계](#4-er-관계)
5. [DDL 예시](#5-ddl-예시)
6. [인덱스 권장](#6-인덱스-권장)
7. [마이그레이션 참고](#7-마이그레이션-참고)

---

## 1. 개요

- **DBMS**: MySQL 8.x
- **데이터베이스명**: `money_mate` (application.properties 기준)
- **ORM/접근**: MyBatis (XML 매퍼)
- **테이블**: `expenses`, `budgets`, `travelers` (매퍼 및 엔티티 기준)

---

## 2. 테이블 목록

| 테이블명 | 설명 |
|----------|------|
| expenses | 지출 내역 (항목명, 금액, 지출자, 카테고리) |
| budgets | 여행(카테고리)별 예산 (총액, 시작일, 종료일) |
| travelers | 동행자 (카테고리별 이름 목록) |

---

## 3. 테이블 상세

### 3.1 expenses (지출)

지출 한 건당 한 행. 카테고리(여행)별로 여러 건 존재.

| 컬럼명 | 타입 | NULL | 키 | 기본값 | 설명 |
|--------|------|------|-----|--------|------|
| id | BIGINT | NO | PK | AUTO_INCREMENT | 지출 고유 ID |
| category | VARCHAR | NO | | | 여행(카테고리) 이름 |
| title | VARCHAR | NO | | | 지출 항목명 (예: 맛집, 교통비) |
| amount | DOUBLE | NO | | | 금액 (원) |
| payer | VARCHAR | NO | | | 지출자(결제한 사람) 이름 |

**매퍼**: ExpenseMapper.xml  
- insert: insertExpense  
- select: getAllExpenses, getExpensesByCategory  
- update: updateExpense  
- delete: deleteExpense  

---

### 3.2 budgets (예산)

여행(카테고리)당 예산 한 건. 같은 카테고리에 대해 upsert 형태로 사용 가능 (매퍼에 update by category 존재).

| 컬럼명 | 타입 | NULL | 키 | 기본값 | 설명 |
|--------|------|------|-----|--------|------|
| id | BIGINT | NO | PK | AUTO_INCREMENT | 예산 고유 ID |
| category | VARCHAR | NO | | | 여행(카테고리) 이름 (유일 권장) |
| total_amount | INT | NO | | | 총 예산 금액 (원) |
| start_date | DATE | YES | | | 여행 시작일 |
| end_date | DATE | YES | | | 여행 종료일 |

**매퍼**: BudgetMapper.xml  
- insert: insertBudget  
- update: updateBudget (WHERE category = #{category})  
- select: getBudgetByCategory  

---

### 3.3 travelers (동행자)

여행(카테고리)별로 “같이 간 사람” 이름을 저장. 한 사람당 한 행 (같은 이름이 같은 카테고리에 중복 가능 여부는 비즈니스 규칙에 따름).

| 컬럼명 | 타입 | NULL | 키 | 기본값 | 설명 |
|--------|------|------|-----|--------|------|
| id | BIGINT | NO | PK | AUTO_INCREMENT | 동행자 레코드 ID |
| category | VARCHAR | NO | | | 여행(카테고리) 이름 |
| name | VARCHAR | NO | | | 동행자 이름 |

**매퍼**: TravelerMapper.xml  
- insert: saveName  
- select: findNamesByCategory  

**삭제**: ExpenseMapper.deleteName → `DELETE FROM travelers WHERE id = #{id}`

---

## 4. ER 관계

- **expenses.category** ↔ **budgets.category**: 논리적으로 같은 “여행” 식별자. FK 없이 문자열로 일치.
- **expenses.category** ↔ **travelers.category**: 동일.
- **expenses.payer**: 지출자 이름 (문자열). travelers.name과 개념적으로 연결 가능하나 FK 없음.

```
[ budgets ]          [ travelers ]
     |                      |
   category              category
     |                      |
     +----------+-----------+
                |
           [ expenses ]
            category, payer
```

---

## 5. DDL 예시

아래는 스키마를 직접 생성할 때 참고할 수 있는 DDL 예시입니다.  
(실제 프로젝트가 JPA `ddl-auto=update` 등을 사용할 수 있으므로, 운영에서는 마이그레이션 도구 사용 권장.)

```sql
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS money_mate
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE money_mate;

-- 지출
CREATE TABLE IF NOT EXISTS expenses (
  id         BIGINT       NOT NULL AUTO_INCREMENT,
  category   VARCHAR(255) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  amount     DOUBLE       NOT NULL,
  payer      VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 예산
CREATE TABLE IF NOT EXISTS budgets (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  category     VARCHAR(255) NOT NULL,
  total_amount INT          NOT NULL,
  start_date   DATE         DEFAULT NULL,
  end_date     DATE         DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 동행자
CREATE TABLE IF NOT EXISTS travelers (
  id       BIGINT       NOT NULL AUTO_INCREMENT,
  category VARCHAR(255) NOT NULL,
  name     VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 6. 인덱스 권장

- **expenses**: `category` (카테고리별 조회), 필요 시 `(category, payer)` 복합 인덱스 (지출자별 집계 시).
- **budgets**: `category` UNIQUE 권장 (카테고리당 예산 1건).
- **travelers**: `category` (카테고리별 목록 조회).

```sql
CREATE INDEX idx_expenses_category ON expenses (category);
CREATE UNIQUE INDEX idx_budgets_category ON budgets (category);
CREATE INDEX idx_travelers_category ON travelers (category);
```

---

## 7. 마이그레이션 참고

- 스키마 변경 시 기존 데이터 백업 후 적용.
- 컬럼 추가/타입 변경 시 MyBatis 매퍼와 모델(DTO/엔티티) 동기화 필요.
- application.properties의 `spring.jpa.hibernate.ddl-auto`와 MyBatis를 함께 사용하는 경우, 테이블 생성 주체를 한쪽으로 통일하는 것이 안전합니다.

---

*문서 버전: 1.0 | MoneyMate Database Schema*

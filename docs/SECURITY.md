# MoneyMate 보안 가이드

보안 관련 설정·권장 사항·주의 사항을 정리합니다.

---

## 목차

1. [현재 상태](#1-현재-상태)
2. [인증·인가](#2-인증인가)
3. [CORS](#3-cors)
4. [입력 검증](#4-입력-검증)
5. [DB·시크릿](#5-db시크릿)
6. [배포 시 권장](#6-배포-시-권장)

---

## 1. 현재 상태

- **인증**: 없음. API는 누구나 호출 가능 (개발용).
- **CORS**: 백엔드에서 `http://localhost:3000` (및 프로덕션 도메인) 허용.
- **HTTPS**: 로컬은 HTTP, 프로덕션에서는 HTTPS 사용 권장.
- **시크릿**: DB 비밀번호 등은 application.properties 또는 환경 변수로 관리. 저장소에 평문 비밀번호 커밋 금지.

---

## 2. 인증·인가

- **도입 시**: JWT(토큰) 또는 세션 기반 로그인을 도입하면, 사용자별로 지출·예산·동행자 데이터를 구분할 수 있습니다.
- **Spring Security**: 필터에서 토큰/세션 검증, Controller 또는 메서드 단위 @PreAuthorize 등으로 권한 제어 가능.
- **프론트**: 로그인 페이지, 토큰 저장(메모리 또는 httpOnly 쿠키), API 요청 시 Authorization 헤더 또는 쿠키 전달.

현재 버전에서는 인증이 없으므로, 공용·내부용으로만 사용하고 외부에 노출하지 않는 것을 권장합니다.

---

## 3. CORS

- 백엔드 `@CrossOrigin(origins = "http://localhost:3000")` 로 프론트 Origin만 허용합니다.
- 프로덕션 배포 시 `origins` 를 실제 프론트 도메인(예: `https://moneymate.example.com`)으로 제한합니다.
- 와일드카드 `*` 는 자격 증명(쿠키 등)을 쓰는 경우 브라우저에서 제한되므로, 가능하면 구체적인 Origin을 나열합니다.

---

## 4. 입력 검증

- **필수 필드**: API에서 category, title, amount, payer 등 필수 필드가 없으면 400 Bad Request 반환을 권장합니다.
- **타입·범위**: amount가 숫자인지, totalAmount가 양수인지 등 검증하면 SQL 인젝션·비즈니스 오류를 줄일 수 있습니다.
- **길이·형식**: 문자열 길이, 날짜 형식(YYYY-MM-DD) 등은 Controller 또는 DTO에서 @Valid, @NotNull, @Size 등으로 검증할 수 있습니다.
- **MyBatis**: 파라미터 바인딩(#{} 사용)으로 SQL 인젝션을 방지합니다. `${}` 사용은 지양합니다.

---

## 5. DB·시크릿

- **비밀번호**: application.properties에 평문 비밀번호를 두지 않고, 환경 변수(예: SPRING_DATASOURCE_PASSWORD)로 주입합니다.
- **저장소**: .env, application-prod.properties 등 시크릿이 포함된 파일은 .gitignore에 넣고 커밋하지 않습니다.
- **DB 권한**: 애플리케이션 계정은 필요한 테이블에만 CRUD 권한을 부여하고, DROP 등은 제한합니다.

---

## 6. 배포 시 권장

- **HTTPS**: 역방향 프록시(Nginx 등) 또는 로드 밸런서에서 TLS 종료.
- **헤더**: X-Frame-Options, X-Content-Type-Options, Content-Security-Policy 등 보안 헤더 설정.
- **로그**: 비밀번호·토큰이 로그에 남지 않도록 주의합니다.
- **의존성**: npm audit, OWASP Dependency Check 등으로 알려진 취약점을 점검합니다.

---

*문서 버전: 1.0 | MoneyMate Security*

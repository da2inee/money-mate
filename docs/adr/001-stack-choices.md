# ADR 001: 기술 스택 선택

## 상태

수락됨 (Accepted)

## 배경

MoneyMate는 여행별 예산·지출·동행자·정산을 관리하는 웹 앱으로, 빠른 개발과 유지보수 용이성을 고려해 기술 스택을 결정해야 했습니다.

## 결정

- **프론트엔드**: React 19 + TypeScript + React Router 7 + MUI 7 + Axios
- **백엔드**: Spring Boot 3.4 + Java 21
- **DB 접근**: MyBatis 3.0 (XML 매퍼)
- **DB**: MySQL 8.x

## 이유

- **React + TypeScript**: 컴포넌트 재사용, 타입 안정성, 풍부한 생태계. SPA에 적합.
- **Spring Boot**: REST API 구축이 빠르고, 설정이 간소화되어 있음.
- **MyBatis**: SQL을 직접 제어할 수 있어 복잡한 쿼리나 마이그레이션 시 유연함. XML 매퍼로 가독성 확보.
- **MySQL**: 관계형 데이터(지출·예산·동행자)에 적합하고, 운영 환경에서 익숙함.

## 결과

- 프론트와 백엔드가 명확히 분리되어 독립적으로 빌드·배포 가능.
- MyBatis로 테이블·컬럼 변경 시 매퍼와 모델만 동기화하면 됨.
- 추후 인증·다중 사용자 도입 시 Spring Security 등으로 확장 가능.

## 참고

- ARCHITECTURE.md
- PROJECT_OVERVIEW.md

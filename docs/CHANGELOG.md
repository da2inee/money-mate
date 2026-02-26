# Changelog

MoneyMate 프로젝트의 버전별 변경 사항을 기록합니다.  
형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 참고합니다.

---

## [Unreleased]

### Added
- (예정) 다중 사용자 지원
- (예정) 정산 제안 API (서버 측 계산)

### Changed
- (없음)

### Fixed
- (없음)

---

## [1.0.0] - 2025-02-26 (가정)

### Added
- 메인 화면: 여행 카테고리 선택 (제주, 서울, 유럽 여행 + 사용자 추가)
- "다른 여행 추가" 모달 및 localStorage 저장
- 카테고리 페이지: 예산 설정/수정, 여행 시작일·종료일
- 동행자(같이 간 사람) 등록·삭제
- 지출 추가·목록·수정·삭제
- 지출자별 합계(개인 사용 금액) 표시
- 정산 제안: "누가 누구에게 얼마" 자동 계산 (클라이언트 utils/settlement.ts)
- 프론트: React 19, TypeScript, React Router 7, MUI 7, Axios
- 백엔드: Spring Boot 3.4, Java 21, MyBatis, MySQL
- API: /expenses, /budget, /category (동행자)
- 문서: PROJECT_OVERVIEW, API_SPECIFICATION, ARCHITECTURE, DATABASE_SCHEMA, USER_GUIDE, DEVELOPER_GUIDE, DEPLOYMENT, TROUBLESHOOTING, CONTRIBUTING, ADR, openapi.yaml

### Changed
- (초기 릴리스)

### Fixed
- (없음)

---

## 버전 규칙

- **Major (X.0.0)**: 하위 호환되지 않는 API·동작 변경
- **Minor (x.Y.0)**: 하위 호환되는 기능 추가
- **Patch (x.y.Z)**: 버그 수정, 문서 수정

---

[Unreleased]: https://github.com/.../compare/v1.0.0...HEAD
[1.0.0]: https://github.com/.../releases/tag/v1.0.0

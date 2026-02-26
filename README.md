# MoneyMate

여행별 예산·지출 관리 웹 앱입니다.  
전체 예산을 정하고, 항목별 지출 금액·지출자를 입력해 남은 예산을 계산하고, 함께 간 사람끼리 정산 제안을 볼 수 있습니다.

---

**👋 처음 보시는 분** → **[START_HERE.md](docs/START_HERE.md)** (이 프로젝트가 뭔지, 어떻게 돌리는지, 코드는 어디 있는지 한 번에 정리)

**📋 [프로젝트 전체 분석](docs/PROJECT_OVERVIEW.md)** — 구조, API, 데이터 흐름, 주요 파일  
**📄 [전체 소스 한 문서 분석](docs/FULL_SOURCE_ANALYSIS.md)** — 프론트/백엔드 소스 전부를 하나의 문서로 요약

**추가 문서**: [API 명세](docs/API_SPECIFICATION.md) · [API 예시](docs/API_EXAMPLES.md) · [아키텍처](docs/ARCHITECTURE.md) · [DB 스키마](docs/DATABASE_SCHEMA.md) · [사용자 가이드](docs/USER_GUIDE.md) · [개발자 가이드](docs/DEVELOPER_GUIDE.md) · [배포](docs/DEPLOYMENT.md) · [트러블슈팅](docs/TROUBLESHOOTING.md) · [테스트](docs/TESTING.md) · [보안](docs/SECURITY.md) · [참조](docs/REFERENCE.md) · [용어](docs/GLOSSARY.md) · [상세 플로우](docs/DETAILED_FLOWS.md) · [기여](CONTRIBUTING.md) · [변경 이력](docs/CHANGELOG.md)

---

## 프로젝트 구조

```
MoneyMate/
├── money-mate-client/     # 프론트엔드 (React + TypeScript)
│   └── src/
│       ├── App.tsx        # 라우팅 (홈 / 카테고리 페이지)
│       ├── pages/         # 홈(메인), 카테고리(지출 관리) 페이지
│       ├── components/    # 예산, 지출 폼/목록, 버튼 등
│       ├── api/           # 백엔드 API 호출 (지출, 예산, 동행자)
│       ├── utils/         # 정산 제안 계산 등 유틸
│       └── index.css      # 전역 스타일·테마 변수
│
└── money-mate-server/     # 백엔드 (Spring Boot + MyBatis)
    └── src/main/java/.../money_mate_server/
        ├── controller/    # REST API (지출, 예산, 동행자)
        ├── service/       # 비즈니스 로직
        ├── mapper/        # MyBatis DB 접근
        └── model/, dto/   # 엔티티·요청 DTO
```

---

## 기능

| 기능 | 설명 |
|------|------|
| 여행별 지출·지출자 입력 | 항목명, 금액, 지불자 입력 후 저장 |
| 지출 합계·잔액 계산 | 예산 대비 사용액·남은 예산 표시 |
| 지출자별 금액 | 인당 총 지출액 표시 |
| 정산 제안 | "누가 누구에게 얼마 전달" 자동 계산 |
| 동행자 관리 | 같이 간 사람 등록·삭제 |
| 새 여행 추가 | 메인에서 여행 이름 입력 후 해당 카테고리로 이동 (localStorage 저장) |

---

## 실행 방법

**클라이언트**
```bash
cd money-mate-client && npm install && npm start
```
→ 브라우저에서 http://localhost:3000

**서버** (JDK 17 필요)
```bash
cd money-mate-server && ./gradlew bootRun
```
→ API: http://localhost:8080

---

## 기술 스택

- **프론트**: React 19, TypeScript, React Router, MUI, Axios
- **백엔드**: Spring Boot, MyBatis
- **DB**: 프로젝트 설정에 따름 (H2/MySQL 등)

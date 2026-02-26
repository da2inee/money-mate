# MoneyMate 테스트 가이드

테스트 전략, 실행 방법, 작성 가이드를 정리합니다.

---

## 목차

1. [테스트 전략](#1-테스트-전략)
2. [프론트엔드 테스트](#2-프론트엔드-테스트)
3. [백엔드 테스트](#3-백엔드-테스트)
4. [테스트 작성 가이드](#4-테스트-작성-가이드)
5. [CI 연동 (참고)](#5-ci-연동-참고)

---

## 1. 테스트 전략

- **단위 테스트**: 비즈니스 로직·유틸 함수·서비스 메서드를 격리해 검증. Mock 사용.
- **컴포넌트/통합 테스트**: React 컴포넌트 렌더링·사용자 동작 시뮬레이션. API는 Mock 또는 MSW 등으로 대체 가능.
- **API 테스트**: Controller를 MockMvc로 호출하고 Service를 Mock해 응답·상태 코드 검증.
- **E2E**: (선택) Cypress, Playwright 등으로 브라우저에서 전체 플로우 검증.

MoneyMate에서는 현재 다음을 권장합니다.

- **프론트**: utils/settlement.ts 단위 테스트, HomePage·JejuPage 등 주요 페이지/컴포넌트 렌더·동작 테스트.
- **백엔드**: Service 단위 테스트(Mock Mapper), Controller API 테스트(Mock Service).

---

## 2. 프론트엔드 테스트

### 2.1 실행

```bash
cd money-mate-client
npm test
```

- Jest + React Testing Library 사용 (Create React App 기본).
- Watch 모드로 실행되며, 변경 시 자동 재실행됩니다. 한 번만 실행하려면 `CI=true npm test` 등으로 실행합니다.

### 2.2 테스트 파일 위치

- `src/utils/settlement.test.ts`: 정산 제안 알고리즘 단위 테스트.
- `src/pages/HomePage.test.tsx`: HomePage 렌더·버튼·모달·카드 클릭 테스트.
- (추가 권장) `src/components/BudgetList.test.tsx`, `ExpenseForm.test.tsx`, `ExpenseList.test.tsx`, `src/pages/JejuPage.test.tsx`.

### 2.3 Mock

- **React Router**: `useNavigate` 를 jest.fn()으로 Mock해 클릭 시 호출 여부·인자 검증.
- **API**: 테스트 시 실제 API를 호출하지 않도록 MSW(Mock Service Worker) 또는 jest.mock으로 api 모듈을 Mock할 수 있습니다. JejuPage 등에서는 Mock이 있으면 네트워크 없이 테스트 가능합니다.

### 2.4 권장 케이스

- **settlement**: 참가자 0명, 총액 0, 1명, 2명 균등/불균등, 3명, participantNames 비어 있을 때 totalPerPerson 키 사용, 10원 미만 차이 무시.
- **HomePage**: 제목·버튼·카테고리 카드 존재, "다른 여행 추가" 클릭 시 모달 열림, 카드 클릭 시 navigate 호출.
- **JejuPage**: (Mock API) 마운트 시 getExpenses·getBudgets·getWhoExpenses 호출, 지출 추가 후 목록 갱신 등.

---

## 3. 백엔드 테스트

### 3.1 실행

```bash
cd money-mate-server
./gradlew test
```

- JUnit 5 + Mockito + Spring Boot Test 사용.
- 단위 테스트는 @ExtendWith(MockitoExtension.class), @Mock, @InjectMocks로 Service 테스트.
- API 테스트는 @WebMvcTest(Controller.class), @MockBean Service, MockMvc로 HTTP 요청/응답 검증.

### 3.2 테스트 파일 위치

- `src/test/java/.../service/ExpenseServiceTest.java`: ExpenseService 단위 테스트.
- `src/test/java/.../service/BudgetServiceTest.java`: BudgetService 단위 테스트.
- `src/test/java/.../service/TravelerServiceTest.java`: TravelerService 단위 테스트.
- `src/test/java/.../controller/ExpenseControllerTest.java`: ExpenseController API 테스트.
- (추가 권장) BudgetControllerTest, TravelerControllerTest.

### 3.3 Mock

- Service 테스트: Mapper를 @Mock으로 두고, when(...).thenReturn(...), verify(...)로 호출·반환값 검증.
- Controller 테스트: Service를 @MockBean으로 두고, MockMvc로 HTTP 요청을 보낸 뒤 status(), jsonPath() 등으로 응답 검증.

### 3.4 DB 연동 테스트 (선택)

- @SpringBootTest + @Transactional로 실제 DB에 접속해 Mapper·Service 통합 테스트를 할 수 있습니다. 이때 테스트용 DB 또는 H2 인메모리 DB를 사용하는 구성을 권장합니다.

---

## 4. 테스트 작성 가이드

### 4.1 네이밍

- **파일명**: 테스트 대상 파일명 + `.test.ts` / `.test.tsx` (프론트), 테스트 대상 클래스명 + `Test` (백엔드).
- **테스트 케이스**: "동작_조건_기대결과" 또는 "메서드명_시나리오_기대" 형태. 한글 @DisplayName 사용 가능.

### 4.2 Given-When-Then

- **Given**: Mock 설정, 테스트 데이터 준비.
- **When**: 테스트 대상 메서드/동작 실행.
- **Then**: assert, verify로 결과 검증.

### 4.3 격리

- 각 테스트는 서로 의존하지 않도록 합니다. beforeEach에서 Mock 초기화, localStorage clear 등으로 상태를 리셋합니다.
- API·DB를 Mock해 외부 의존성을 제거하면 빠르고 안정적인 테스트가 됩니다.

---

## 5. CI 연동 (참고)

- GitHub Actions, GitLab CI 등에서 `npm test`(프론트), `./gradlew test`(백엔드)를 실행해 PR 시 자동 검증할 수 있습니다.
- CI 환경에서는 `CI=true npm test` 로 Watch 없이 한 번만 실행하는 설정을 권장합니다.

---

*문서 버전: 1.0 | MoneyMate Testing Guide*

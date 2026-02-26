# ADR 003: 정산 제안 알고리즘을 클라이언트에 구현

## 상태

수락됨 (Accepted)

## 배경

“누가 누구에게 얼마를 주면 되는지” 정산 제안을 계산하는 로직을 프론트엔드에 둘지, 백엔드에 둘지 결정이 필요했습니다.

## 결정

- **정산 제안 알고리즘을 클라이언트(utils/settlement.ts)에 구현.**
- 서버는 지출·동행자 데이터만 제공하고, 정산 제안 계산은 하지 않음.

## 이유

- 정산 제안은 “지출자별 합계”와 “동행자 목록”만 있으면 계산 가능하며, 추가 DB/API가 필요 없음.
- 클라이언트에서 이미 지출·동행자 데이터를 가지고 있으므로, 한 번 더 API를 호출하지 않고 즉시 계산·표시할 수 있음.
- 알고리즘이 순수 함수 형태로 단순해 단위 테스트하기 쉬움.
- 나중에 “정산 제안 저장”이나 “여러 통화/반올림 규칙” 등이 필요해지면 서버에 정산 API를 추가하는 것을 검토할 수 있음.

## 결과

- `getSettlementSuggestions(totalPerPerson, participantNames, totalSpent)` 가 JejuPage에서 호출되어 정산 제안 리스트를 렌더링함.
- 서버 부하는 증가하지 않으며, 클라이언트 연산 부하는 미미함.
- 정산 로직 변경 시 프론트엔드만 배포하면 됨 (API 호환성 유지).

## 참고

- utils/settlement.ts
- JejuPage.tsx (settlementSteps, getSettlementSuggestions)
- ARCHITECTURE.md (데이터 흐름)

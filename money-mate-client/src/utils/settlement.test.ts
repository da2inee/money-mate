/**
 * 정산 제안 알고리즘 단위 테스트
 */
import { getSettlementSuggestions } from './settlement';

describe('getSettlementSuggestions', () => {
  it('참가자가 없으면 빈 배열 반환', () => {
    expect(
      getSettlementSuggestions({}, [], 0)
    ).toEqual([]);
    expect(
      getSettlementSuggestions({ A: 100 }, [], 100)
    ).toEqual([]);
  });

  it('총 지출이 0이면 빈 배열 반환', () => {
    expect(
      getSettlementSuggestions({}, ['A', 'B'], 0)
    ).toEqual([]);
  });

  it('1명만 있으면 정산 단계 없음', () => {
    expect(
      getSettlementSuggestions({ A: 10000 }, ['A'], 10000)
    ).toEqual([]);
  });

  it('2명이고 균등하면 빈 배열', () => {
    expect(
      getSettlementSuggestions({ A: 5000, B: 5000 }, ['A', 'B'], 10000)
    ).toEqual([]);
  });

  it('2명이고 한 명이 더 냈으면 한 단계 반환', () => {
    const result = getSettlementSuggestions(
      { A: 10000, B: 0 },
      ['A', 'B'],
      10000
    );
    expect(result).toHaveLength(1);
    expect(result[0].from).toBe('B');
    expect(result[0].to).toBe('A');
    expect(result[0].amount).toBe(5000);
  });

  it('3명 균등 분배 시 빈 배열', () => {
    expect(
      getSettlementSuggestions(
        { A: 10000, B: 10000, C: 10000 },
        ['A', 'B', 'C'],
        30000
      )
    ).toEqual([]);
  });

  it('한 명이 전부 냈을 때 나머지가 그 사람에게 전달', () => {
    const result = getSettlementSuggestions(
      { A: 30000, B: 0, C: 0 },
      ['A', 'B', 'C'],
      30000
    );
    expect(result.length).toBeGreaterThanOrEqual(1);
    const totalFromB = result
      .filter((s) => s.from === 'B')
      .reduce((sum, s) => sum + s.amount, 0);
    const totalFromC = result
      .filter((s) => s.from === 'C')
      .reduce((sum, s) => sum + s.amount, 0);
    expect(totalFromB).toBe(10000);
    expect(totalFromC).toBe(10000);
  });

  it('participantNames가 비어 있으면 totalPerPerson 키로 참가자 구성', () => {
    const result = getSettlementSuggestions(
      { A: 20000, B: 0 },
      [],
      20000
    );
    expect(result).toHaveLength(1);
    expect(result[0].from).toBe('B');
    expect(result[0].to).toBe('A');
    expect(result[0].amount).toBe(10000);
  });

  it('10원 미만 차이는 무시 (threshold)', () => {
    const result = getSettlementSuggestions(
      { A: 10005, B: 9995 },
      ['A', 'B'],
      20000
    );
    expect(result).toEqual([]);
  });
});

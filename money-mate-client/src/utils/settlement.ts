/**
 * 정산 제안: 누가 누구에게 얼마를 주면 되는지 계산
 * - 참가자별 1인당 부담금(평균)을 구하고, 더 낸 사람에게 덜 낸 사람이 돈을 주는 방식
 */
export interface SettlementStep {
  from: string;
  to: string;
  amount: number;
}

export function getSettlementSuggestions(
  totalPerPerson: Record<string, number>,
  participantNames: string[],
  totalSpent: number
): SettlementStep[] {
  const participants = participantNames.length > 0 ? participantNames : Object.keys(totalPerPerson);
  if (participants.length === 0 || totalSpent <= 0) return [];

  const average = Math.floor(totalSpent / participants.length);
  const balance: { name: string; balance: number }[] = participants.map((name) => ({
    name,
    balance: (totalPerPerson[name] || 0) - average,
  }));

  const debtors = balance.filter((b) => b.balance < -10).sort((a, b) => a.balance - b.balance);
  const creditors = balance.filter((b) => b.balance > 10).sort((a, b) => b.balance - a.balance);

  const steps: SettlementStep[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(-debtor.balance, creditor.balance);
    if (amount >= 10) {
      steps.push({ from: debtor.name, to: creditor.name, amount: Math.round(amount) });
    }
    debtor.balance += amount;
    creditor.balance -= amount;
    if (debtor.balance >= -10) i++;
    if (creditor.balance <= 10) j++;
  }

  return steps;
}

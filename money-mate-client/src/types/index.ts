/**
 * MoneyMate 공통 타입 정의
 *
 * API 요청/응답, 페이지/컴포넌트에서 공통으로 사용하는 타입을 모아 둡니다.
 */

// ========== 지출 ==========

export interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  payer: string;
}

export interface ExpenseRequest {
  category: string;
  title: string;
  amount: number;
  payer: string;
}

// ========== 예산 ==========

export interface Budget {
  id?: number;
  category: string;
  totalAmount: number;
  startDate?: string;
  endDate?: string;
}

export interface BudgetResponse {
  totalAmount: number;
  startDate?: string;
  endDate?: string;
}

// ========== 동행자 ==========

export interface Traveler {
  id: number;
  name: string;
}

export interface TravelerRequest {
  name: string;
  category: string;
}

// ========== 정산 ==========

export interface SettlementStep {
  from: string;
  to: string;
  amount: number;
}

// ========== 여행 카테고리 (홈) ==========

export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  color: string;
}

// ========== API 에러 ==========

export interface ApiError {
  message?: string;
  code?: string;
  status?: number;
}

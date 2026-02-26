/**
 * expenseApi.ts - 지출 관련 API
 *
 * - addExpense: 지출 추가 POST /expenses
 * - getExpenses: 카테고리별 또는 전체 지출 조회 GET /expenses?category=
 * - deleteExpenses: 지출 삭제 DELETE /expenses/:id
 * - deleteName: 동행자(이름) 삭제 DELETE /expenses/category/:id
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface ExpenseRequest {
    category: string;
    title: string;
    amount: number;
    payer: string;
}

export interface ExpenseResponse {
    id: number;
    category: string;
    title: string;
    amount: number;
    payer: string;
}

// 지출 추가
export const addExpense = async (expense: ExpenseRequest): Promise<void> => {
    await axios.post(`${API_BASE_URL}/expenses`, expense);
};
   

export const getExpenses = async (category?: string): Promise<ExpenseResponse[]> => {
  const response = await axios.get(`${API_BASE_URL}/expenses`, {
    params: category ? { category } : {},
  });
  return response.data;
};

/** 지출 수정 PUT /expenses/:id */
export const updateExpense = async (id: number, expense: ExpenseRequest): Promise<ExpenseResponse> => {
  const response = await axios.put(`${API_BASE_URL}/expenses/${id}`, expense);
  return response.data;
};

export const deleteExpenses = async (id?: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/expenses/${id}`, {
    });
};

export const deleteName = async (id?: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/expenses/category/${id}`, {
    });
};

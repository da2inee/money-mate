// src/api/expenseApi.ts
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
  
export const deleteExpenses = async (id?: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/expenses/${id}`, {
    });
};

export const deleteName = async (name?: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/expenses/${name}`, {
    });
};

/**
 * budgetApi.ts - 예산 관련 API
 *
 * - createBudget: 예산 생성 POST /budget
 * - getBudgets: 카테고리별 예산 조회 GET /budget/:category
 * - updateBudget: 예산 수정
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/budget';

/** 예산 생성 (startDate, endDate 선택) */
export const createBudget = async (budget: {
  category: string;
  totalAmount: number;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const response = await axios.post(API_BASE_URL, budget);
    return response.data;
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error;
  }
};

// 예산 목록 가져오기
export const getBudgets = async (category: string): Promise<{ totalAmount: number, startDate: string,endDate: string  }> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${category}`);
      console.log("성공")
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  };  


/** 예산 수정 (startDate, endDate 선택) */
export const updateBudget = async (
  category: string,
  inputAmount: number,
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${category}`, {
      inputAmount,
      startDate: startDate || null,
      endDate: endDate || null,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
};


  

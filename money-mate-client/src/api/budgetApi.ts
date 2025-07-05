// src/api/budgetApi.ts
import axios from 'axios';


const API_BASE_URL = 'http://localhost:8080/budget'; // 백엔드 URL

// 예산 생성
export const createBudget = async (budget: { category: string; totalAmount: number }) => {
  try {
    const response = await axios.post(API_BASE_URL, budget);
    return response.data;
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error; // 오류를 던져서 호출한 곳에서 처리
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


// 예산 수정
export const updateBudget = async (category: string, inputAmount: number) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${category}`, { inputAmount });
      return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };


  

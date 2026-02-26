/**
 * travelerApi.ts - 동행자(같이 간 사람) API
 *
 * - whoExpenses: 동행자 추가 POST /category
 * - getWhoExpenses: 카테고리별 동행자 목록 조회 GET /category?category=
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/category';

interface Who {
  id: number;
  name: string;
}

export const whoExpenses = async (category: string, name: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}`, {name,category});
};

export const getWhoExpenses = async (category?: string): Promise<Who[]> => {
        console.log('dpdlvkdp');
  
  const response = await axios.get(`${API_BASE_URL}`,{
            params: category ? { category } : {},
    });
    console.log('조회',response);
    return response.data;
};

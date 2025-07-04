// src/api/travelerApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/category'; // 백엔드 URL

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

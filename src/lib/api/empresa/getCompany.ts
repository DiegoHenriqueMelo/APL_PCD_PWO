import { getAuthHeaders } from '../apiClient';

export const getCompany = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3001/get/empresa/${id}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return null;
  }
};

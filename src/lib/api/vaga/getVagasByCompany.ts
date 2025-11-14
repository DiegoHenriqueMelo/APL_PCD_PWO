import { getAuthHeaders } from '../apiClient';

export const getVagasByCompany = async (companyId: string) => {
  try {
    console.log('=== GET VAGAS BY COMPANY ===');
    console.log('Company ID:', companyId);
    
    const headers = getAuthHeaders();

    const response = await fetch(`http://localhost:3001/get/vagas/byId/${companyId}`, {
      method: 'GET',
      headers: {
        ...headers,
        Accept: 'application/json',
      },
    });

    console.log('Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Vagas da empresa:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar vagas da empresa:', error);
    throw error;
  }
};

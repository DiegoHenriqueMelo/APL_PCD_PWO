import { getAuthHeaders } from '../apiClient';

export const getCompanyByEmail = async (email: string) => {
  try {
    // Encode o email para a URL (converte @ para %40, etc)
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(`http://localhost:3001/get/contratante/byEmail/${encodedEmail}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar candidato por email:', error);
    throw error;
  }
};

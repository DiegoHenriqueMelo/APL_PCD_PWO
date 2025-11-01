import { getAuthHeaders } from '../apiClient';

export const updateCompany = async (id: string, data: any) => {
  try {
    console.log('=== UPDATE EMPRESA ===');
    console.log('ID:', id);
    console.log('Dados:', data);
    
    const response = await fetch(`http://localhost:3001/update/contratante/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    console.log('Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar empresa');
    }

    const result = await response.json();
    console.log('Resposta:', result);
    return result;
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    throw error;
  }
};

import { getAuthHeaders } from '../apiClient';

export const updateCandidate = async (id: string, data: any) => {
  try {
    console.log('=== UPDATE CANDIDATO ===');
    console.log('ID:', id);
    console.log('Dados:', data);
    
    const response = await fetch(`http://localhost:3001/update/candidato/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar candidato');
    }

    const result = await response.json();
    console.log('Resposta:', result);
    return result;
  } catch (error) {
    console.error('Erro ao atualizar candidato:', error);
    throw error;
  }
};

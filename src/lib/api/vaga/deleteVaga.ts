import { getAuthHeaders } from '../apiClient';

export const deleteVaga = async (vagaId: string) => {
  try {
    const headers = {
      ...getAuthHeaders(),
      Accept: 'application/json',
    };

    const response = await fetch(`http://localhost:3001/delete/vaga/${vagaId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro ao deletar vaga: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('deleteVaga error:', error);
    throw error;
  }
};

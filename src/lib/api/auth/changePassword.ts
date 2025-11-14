import { getAuthHeaders } from '../apiClient';

export const changePassword = async (id: string, email: string, newSenha: string, confirmSenha: string) => {
  try {
    const url = `http://localhost:3001/mudarSenha/${id}`;
    const payload = { 
      email: email,
      newSenha: newSenha,
      confirmSenha: confirmSenha
    };
    
    console.log('=== MUDAR SENHA ===');
    console.log('URL:', url);
    console.log('Método: PUT');
    console.log('Payload:', payload);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dados da resposta:', data);
    return data;
  } catch (error) {
    console.error('Erro ao mudar senha:', error);
    throw error;
  }
};

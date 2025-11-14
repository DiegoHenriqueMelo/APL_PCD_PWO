import { getAuthHeaders } from '../apiClient';

export let createAcessibilidade = async (data: { descricao: string }) => {
  try {
    let response = await fetch('http://localhost:3001/adm/create/acessibilidade', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error creating acessibilidade:', error);
    throw error;
  }
};

import { getAuthHeaders } from '../apiClient';

export let createSubTipo = async (data: {
    descricao: string;
    hora: string;
    tipo: string;
    barreira: string;
    acessibilidade: string;
}) => {
  try {
    let response = await fetch('http://localhost:3001/adm/create/subtipo', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error creating subtipo:', error);
    throw error;
  }
};

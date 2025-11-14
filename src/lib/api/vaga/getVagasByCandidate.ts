import { getAuthHeaders } from '../apiClient';

export const getVagasByCandidate = async (candidateId: string) => {
  try {
    console.log('[getVagasByCandidate] iniciando requisição para candidateId:', candidateId);
    
    const headers = getAuthHeaders();
    
    console.log('[getVagasByCandidate] headers:', headers);
    const url = `http://localhost:3001/get/vagas/byCandidato/${candidateId}`;
    console.log('[getVagasByCandidate] fetch ->', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...headers,
        Accept: 'application/json',
      },
    });

    console.log('[getVagasByCandidate] status:', response.status);
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log('[getVagasByCandidate] data:', data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
      }
      return data;
    } catch (err) {
      // resposta não JSON
      console.warn('[getVagasByCandidate] resposta não-JSON:', text);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
      }
      return text;
    }
  } catch (error) {
    console.error('[getVagasByCandidate] Erro ao buscar vagas por candidato:', error);
    throw error;
  }
};

import { getAuthHeaders } from '../apiClient';

export const getVagaById = async (id: string) => {
  try {
    console.log('=== GET VAGA BY ID ===');
    console.log('ID:', id);
    
    const headers = getAuthHeaders();
    
    // Tenta primeiro a rota específica por ID
    let response = await fetch(`http://localhost:3001/get/vaga/${id}`, {
      method: 'GET',
      headers,
    });

    console.log('Status:', response.status);

    // Se retornar 404, busca todas as vagas e filtra pelo ID
    if (response.status === 404) {
      console.log('Rota específica não encontrada, buscando todas as vagas...');
      
      const allVagasResponse = await fetch('http://localhost:3001/get/vagas', {
        method: 'GET',
        headers,
      });

      if (!allVagasResponse.ok) {
        throw new Error(`HTTP error! status: ${allVagasResponse.status}`);
      }

      const allVagasData = await allVagasResponse.json();
      console.log('Todas as vagas:', allVagasData);
      
      // Extrai o array de vagas do formato do backend
      // O backend retorna: { message: Array } ou { message: { data: Array } }
      let vagas = allVagasData?.message?.data || allVagasData?.data || allVagasData?.message || allVagasData || [];
      
      // Se vagas não for um array, tenta extrair de outras formas
      if (!Array.isArray(vagas)) {
        vagas = [];
      }
      
      console.log('Array de vagas:', vagas);
      console.log('É array?', Array.isArray(vagas));
      
      // Filtra pela vaga específica
      const vaga = vagas.find((v: any) => v.id === id);
      
      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }
      
      console.log('Vaga encontrada:', vaga);
      
      // Retorna no mesmo formato que o backend retornaria
      return {
        message: {
          success: true,
          data: vaga
        }
      };
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Vaga:', data);
    return data;
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    throw error;
  }
};

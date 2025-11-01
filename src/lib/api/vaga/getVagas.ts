import { getAuthHeaders } from '../apiClient';

export let getVagas = async (tipoAcessFilter?: string) => {
  try {
    const response = await fetch("http://localhost:3001/get/vagas", {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados recebidos da API:', data);
    
    // Se um filtro de tipo_acess foi fornecido, filtrar as vagas
    if (tipoAcessFilter) {
      console.log('Aplicando filtro de deficiência:', tipoAcessFilter);
      
      // Extrair o prefixo da deficiência do usuário (ex: "DMOTO-305079" -> "DMOTO")
      // Remove números e hífen para pegar apenas o prefixo
      const prefixoDeficiencia = tipoAcessFilter.replace(/[-\d]/g, '');
      console.log('Prefixo da deficiência do usuário:', prefixoDeficiencia);
      
      // A API pode retornar em diferentes formatos:
      // { message: [...] } ou { data: [...] } ou diretamente [...]
      const vagasArray = data?.data || data?.message || data || [];
      console.log('Array de vagas encontrado:', vagasArray);
      
      const filteredVagas = Array.isArray(vagasArray) 
        ? vagasArray.filter((vaga: any) => {
            // A vaga pode ter múltiplos tipos separados por vírgula: "DVISU, DMOTO"
            const tiposVaga = vaga.type_acessibility || vaga.tipo_acess || '';
            console.log(`Vaga "${vaga.titulo}" aceita tipos:`, tiposVaga);
            
            // Extrai os prefixos dos tipos da vaga (remove números e hífen)
            const prefixosVaga = tiposVaga
              .split(',')
              .map((tipo: string) => tipo.trim().replace(/[-\d]/g, ''))
              .filter((prefixo: string) => prefixo.length > 0);
            
            console.log(`Prefixos da vaga "${vaga.titulo}":`, prefixosVaga);
            
            // Verifica se o prefixo da deficiência do usuário está nos prefixos da vaga
            const aceita = prefixosVaga.includes(prefixoDeficiencia);
            console.log(`Vaga "${vaga.titulo}" aceita ${prefixoDeficiencia}?`, aceita);
            
            return aceita;
          })
        : [];
      
      console.log(`Vagas filtradas: ${filteredVagas.length} de ${vagasArray.length}`);
      
      // Manter o mesmo formato da resposta original
      if (data?.data) {
        return { ...data, data: filteredVagas, total: filteredVagas.length };
      } else if (data?.message) {
        return { message: filteredVagas };
      }
      return filteredVagas;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    return [];
  }
};

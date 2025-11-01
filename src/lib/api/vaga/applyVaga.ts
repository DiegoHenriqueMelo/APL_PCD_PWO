import { getAuthHeaders } from '../apiClient';

export let applyVaga = async (applicationData: {
    vaga_id: string;
    id: string;
}) => {
    try {
        const headers = getAuthHeaders();

        const response = await fetch(`http://localhost:3001/register/vaga/${applicationData.id}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ vaga_id: applicationData.vaga_id }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erro na resposta:', errorData);
            throw new Error(`Erro ao aplicar para a vaga: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao aplicar para a vaga:', error);
        throw error;
    }
};

import { getAuthHeaders } from '../apiClient';

export let getAnalitycs = async () => {
    try {
        let response = await fetch('http://localhost:3001/get/adm/dadosAnaliticos', {
            method: 'GET',
            headers: {
                ...getAuthHeaders(),
                Accept: 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados analíticos:', error);
        return {
            sub_types: [],
            barriers: [],
            accessibilities: []
        };
    }
}
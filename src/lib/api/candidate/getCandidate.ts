import { getAuthHeaders } from '../apiClient';

export let getCandidate = async ():Promise<any> =>{
    const result = await fetch('http://localhost:3001/get/canditado', {
        method: 'GET',
        headers: {
            ...getAuthHeaders(),
            Accept: 'application/json',
        },
    });
    const data = await result.json();
    return data;
}
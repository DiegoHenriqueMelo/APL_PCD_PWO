import { getAuthHeaders } from '../apiClient';

export let getCandidate = async ():Promise<any> =>{
    let result = await fetch(`http://localhost:3001/get/canditado`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    let data = await result.json();
    return data;
}
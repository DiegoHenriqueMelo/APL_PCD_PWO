import { getAuthHeaders } from '../apiClient';

export let createBarreira = async (data: { descricao: string }) => {
  try {
    let response = await fetch("http://localhost:3001/adm/create/barreira", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating barreira:", error);
  }
};

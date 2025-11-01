import { getAuthHeaders } from '../apiClient';

export let createVaga = async (vagaData: {
  end_date: Date;
  title: string;
  description: string;
  salary: number;
  location: string;
  type: string;
  company_id: string;
  type_acessibility: string;
}) => {
  try {
    const headers = getAuthHeaders();

    let response = await fetch(
      `http://localhost:3001/create/vaga/${vagaData.company_id}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(vagaData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating vaga:", error);
    throw error;
  }
};

export const loginAdmin = async (credentials: { email: string; senha: string }) => {
  try {
    const response = await fetch('http://localhost:3001/login/administrador', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Erro 400: { message: { message: "Dados invalidos" } }
      const errorMessage = data?.message?.message || data?.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }

    // Sucesso 200: { message: "Login efetuado com sucesso!" }
    return data;
  } catch (error) {
    console.error('Erro no login do administrador:', error);
    throw error;
  }
};

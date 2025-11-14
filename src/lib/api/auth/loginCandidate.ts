export const loginCandidate = async (credentials: { email: string; senha: string }) => {

    console.log(credentials)
  try {
    const payload = JSON.stringify(credentials);
    console.log('=== LOGIN CANDIDATO ===');
    console.log('URL:', 'http://localhost:3001/login/candidato');
    console.log('Payload enviado:', payload);
    
    const response = await fetch('http://localhost:3001/login/candidato', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: payload,
    });

    const data = await response.json();
    console.log('Status da resposta:', response.status);
    console.log('Dados da resposta:', data);

    if (!response.ok) {
      // Erro 400: { message: { message: "Dados invalidos" } }
      const errorMessage = data?.message?.message || data?.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }

    // Sucesso 200: { message: "Login efetuado com sucesso!" }
    return data;
  } catch (error) {
    console.error('Erro no login do candidato:', error);
    throw error;
  }
};

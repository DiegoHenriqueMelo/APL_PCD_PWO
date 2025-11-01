// Decodifica um JWT token (apenas parse, sem validação de assinatura)
export function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

// Verifica se o token expirou
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

// Extrai informações do token
export function getTokenInfo(token: string): {
  id: string | null;
  role: string | null;
  exp: number | null;
} {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return { id: null, role: null, exp: null };
  }

  return {
    id: decoded.id || null,
    role: decoded.role || null,
    exp: decoded.exp || null,
  };
}

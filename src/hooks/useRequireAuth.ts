'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { isTokenExpired } from '@/src/lib/jwt';

/**
 * Hook para verificar se o usuário está autenticado e redirecionar se necessário
 * @param redirectTo - URL para redirecionar se não autenticado (padrão: '/login')
 * @param requiredRole - Role necessária para acessar (opcional)
 */
export function useRequireAuth(
  redirectTo: string = '/login',
  requiredRole?: 'candidate' | 'company' | 'admin'
) {
  const router = useRouter();
  const { user, token, userType, logout } = useAuth();

  useEffect(() => {
    // Verificar se está autenticado
    if (!user || !token) {
      router.push(redirectTo);
      return;
    }

    // Verificar se o token expirou
    if (isTokenExpired(token)) {
      logout();
      router.push(redirectTo);
      return;
    }

    // Verificar role se especificada
    if (requiredRole && userType !== requiredRole) {
      router.push('/');
      return;
    }
  }, [user, token, userType, router, redirectTo, requiredRole, logout]);

  return { user, token, userType };
}

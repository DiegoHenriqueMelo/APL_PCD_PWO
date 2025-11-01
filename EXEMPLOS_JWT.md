# Exemplos de Uso - Autenticação JWT

## Exemplo 1: Página Protegida Simples

```typescript
'use client';

import { useRequireAuth } from '@/src/hooks/useRequireAuth';

export default function MinhasPaginaProtegida() {
  // Redireciona para /login se não autenticado
  const { user, token } = useRequireAuth();

  if (!user) return null; // Loading state

  return (
    <div>
      <h1>Bem-vindo, {user.name}!</h1>
      <p>Esta página é protegida</p>
    </div>
  );
}
```

---

## Exemplo 2: Página Protegida por Role

```typescript
'use client';

import { useRequireAuth } from '@/src/hooks/useRequireAuth';

export default function AdminPanel() {
  // Apenas administradores podem acessar
  const { user } = useRequireAuth('/login/admin', 'admin');

  if (!user) return null;

  return (
    <div>
      <h1>Painel Administrativo</h1>
      <p>Apenas administradores podem ver isso</p>
    </div>
  );
}
```

---

## Exemplo 3: Requisição Autenticada

```typescript
'use client';

import { useState } from 'react';
import { authenticatedFetch } from '@/src/lib/api/apiClient';

export default function CriarVaga() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(
        'http://localhost:3001/create/vaga',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log('Vaga criada:', result);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return <div>...</div>;
}
```

---

## Exemplo 4: Verificar Token Manualmente

```typescript
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { isTokenExpired, getTokenInfo } from '@/src/lib/jwt';

export default function Profile() {
  const { token, logout } = useAuth();

  useEffect(() => {
    if (token) {
      // Obter informações do token
      const info = getTokenInfo(token);
      console.log('User ID:', info.id);
      console.log('Role:', info.role);
      console.log('Expira em:', new Date(info.exp * 1000));

      // Verificar se está expirado
      if (isTokenExpired(token)) {
        console.log('Token expirado! Fazendo logout...');
        logout();
      }
    }
  }, [token, logout]);

  return <div>Perfil</div>;
}
```

---

## Exemplo 5: Interceptor de Erro 401

```typescript
import { getAuthHeaders, getAuthToken } from '@/src/lib/api/apiClient';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export async function apiRequest(url: string, options: RequestInit = {}) {
  const { logout } = useAuth();
  const router = useRouter();

  const response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(),
  });

  // Token inválido ou expirado
  if (response.status === 401) {
    logout();
    router.push('/login');
    throw new Error('Não autenticado');
  }

  return response;
}
```

---

## Exemplo 6: Proteção Client-Side com Redirect

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { isTokenExpired } from '@/src/lib/jwt';

export default function VagasPage() {
  const router = useRouter();
  const { user, token, userType, logout } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    if (!user || !token) {
      router.push('/login');
      return;
    }

    // Verificar expiração
    if (isTokenExpired(token)) {
      logout();
      router.push('/login');
      return;
    }

    // Verificar role (apenas empresas)
    if (userType !== 'company') {
      router.push('/perfil');
      return;
    }

    setIsChecking(false);
  }, [user, token, userType, router, logout]);

  if (isChecking) {
    return <div>Verificando autenticação...</div>;
  }

  return <div>Minhas Vagas</div>;
}
```

---

## Exemplo 7: Logout Automático ao Expirar

```typescript
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { isTokenExpired } from '@/src/lib/jwt';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }) {
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar expiração a cada minuto
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        console.log('Token expirado. Fazendo logout...');
        logout();
        router.push('/login');
      }
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, [token, logout, router]);

  return <>{children}</>;
}
```

---

## Exemplo 8: Obter Dados do Usuário do Token

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getTokenInfo } from '@/src/lib/jwt';
import { useAuth } from '@/src/contexts/AuthContext';

export default function UserInfo() {
  const { token } = useAuth();
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    if (token) {
      const info = getTokenInfo(token);
      setTokenData(info);
    }
  }, [token]);

  if (!tokenData) return null;

  return (
    <div>
      <p>ID: {tokenData.id}</p>
      <p>Role: {tokenData.role}</p>
      <p>Token expira: {new Date(tokenData.exp * 1000).toLocaleString()}</p>
    </div>
  );
}
```

---

## Comparação: Antes vs Depois

### ANTES (com secrets mockados)
```typescript
// AuthContext
const secrets = {
  admin: 'qkwejfo2h3fu2h3pf92pfu9hfpuiw',
  company: 'tey2behTDI57eCOutO753ov7TV6rO',
  candidate: 'yVI7674i76rvOUYfov36tyrvOUTE',
};
document.cookie = `pcd_secret=${secrets[type]}`;

// API Request
const secret = localStorage.getItem('pcd_secret');
headers['x-pcd-secret'] = secret;
```

### DEPOIS (com JWT)
```typescript
// AuthContext
document.cookie = `pcd_token=${authToken}`;

// API Request
const token = localStorage.getItem('@PCDentro:token');
headers['Authorization'] = `Bearer ${token}`;
```

---

## Checklist de Implementação

- [x] Criar biblioteca JWT (`src/lib/jwt.ts`)
- [x] Criar helper de API autenticada (`src/lib/api/apiClient.ts`)
- [x] Atualizar middleware para validar JWT
- [x] Atualizar AuthContext para usar tokens
- [x] Atualizar páginas de login
- [x] Atualizar todas as funções de API
- [x] Criar hook `useRequireAuth`
- [ ] Testar login de candidato
- [ ] Testar login de empresa
- [ ] Testar login de admin
- [ ] Testar requisições autenticadas
- [ ] Testar proteção de rotas
- [ ] Testar expiração de token

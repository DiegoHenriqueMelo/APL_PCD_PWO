# 🔐 Sistema de Autenticação

Documentação completa do sistema de autenticação JWT do **PCDentro**.

## 📋 Visão Geral

O PCDentro usa **JWT (JSON Web Tokens)** para autenticação stateless e segura. Este sistema substituiu o modelo anterior de "secrets mockados" por um sistema robusto e escalável.

---

## 🔑 O que é JWT?

**JWT** é um padrão aberto (RFC 7519) que define uma forma compacta e segura de transmitir informações entre partes como um objeto JSON.

### Estrutura de um JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkNBTkQtMTQ4MDk1Iiwicm9sZSI6ImNhbmRpZGF0byIsImlhdCI6MTY5ODc2MjQwMCwiZXhwIjoxNjk4ODQ4ODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Dividido em 3 partes separadas por `.`:

1. **Header** (Cabeçalho)
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

2. **Payload** (Dados)
```json
{
  "id": "CAND-148095",
  "role": "candidato",
  "iat": 1698762400,
  "exp": 1698848800
}
```

3. **Signature** (Assinatura)
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

---

## 🚀 Fluxo de Autenticação

### 1. Login

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Preenche email + senha
    F->>B: POST /login/candidato
    B->>DB: Verifica credenciais
    DB->>B: Usuário encontrado
    B->>B: Gera JWT token
    B->>F: {user: {...}, token: "eyJ..."}
    F->>F: Salva em localStorage + cookies
    F->>U: Redirect /perfil
```

### 2. Requisição Autenticada

```mermaid
sequenceDiagram
    participant F as Frontend
    participant A as API Client
    participant B as Backend

    F->>A: getVagas()
    A->>A: getAuthHeaders()
    Note over A: Authorization: Bearer {token}
    A->>B: GET /get/vagas
    B->>B: Valida JWT
    alt Token válido
        B->>A: {data: [...]}
        A->>F: Vagas
    else Token inválido
        B->>A: 401 Unauthorized
        A->>F: Logout + Redirect /login
    end
```

### 3. Logout

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant LS as LocalStorage
    participant C as Cookies

    U->>F: Clica em Logout
    F->>LS: Remove user + token
    F->>C: Clear pcd_token + pcd_role
    F->>U: Redirect /login
```

---

## 🧰 Implementação

### Backend (API)

**Endpoint de Login**:
```javascript
POST /login/candidato
POST /login/empresa
POST /login/admin
```

**Request Body**:
```json
{
  "email": "exemplo@email.com",
  "senha": "senha123"
}
```

**Response (Success - 200)**:
```json
{
  "message": {
    "user": {
      "id": "CAND-148095",
      "nome": "João Silva",
      "email": "joao@email.com",
      "cpf": "12345678901",
      "deficiencia": "DVISU-0001",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401)**:
```json
{
  "error": "Credenciais inválidas"
}
```

---

### Frontend

#### 1. Biblioteca JWT (`src/lib/jwt.ts`)

```typescript
/**
 * Decodifica um token JWT sem validar a assinatura
 */
export function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Verifica se o token expirou
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

/**
 * Extrai informações úteis do token
 */
export function getTokenInfo(token: string) {
  const decoded = decodeJWT(token);
  return {
    id: decoded?.id,
    role: decoded?.role,
    exp: decoded?.exp,
    iat: decoded?.iat,
  };
}
```

#### 2. API Client (`src/lib/api/apiClient.ts`)

```typescript
/**
 * Obtém o token do localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('@PCDentro:token');
}

/**
 * Gera headers com autenticação
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Wrapper para fetch autenticado
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
) {
  return fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
}
```

#### 3. AuthContext (`src/contexts/AuthContext.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  userType: 'candidate' | 'company' | 'admin' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string, type: UserType) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    const storedUser = localStorage.getItem('@PCDentro:user');
    const storedToken = localStorage.getItem('@PCDentro:token');
    const storedType = localStorage.getItem('@PCDentro:userType');

    if (storedUser && storedToken && storedType) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setUserType(storedType as UserType);
    }
  }, []);

  const login = (user: User, authToken: string, type: UserType) => {
    setUser(user);
    setToken(authToken);
    setUserType(type);

    // Persistir
    localStorage.setItem('@PCDentro:user', JSON.stringify(user));
    localStorage.setItem('@PCDentro:token', authToken);
    localStorage.setItem('@PCDentro:userType', type);

    // Cookies para middleware
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `pcd_token=${authToken}; path=/; expires=${expires}`;
    document.cookie = `pcd_role=${type}; path=/; expires=${expires}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserType(null);

    localStorage.removeItem('@PCDentro:user');
    localStorage.removeItem('@PCDentro:token');
    localStorage.removeItem('@PCDentro:userType');

    document.cookie = 'pcd_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'pcd_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  return (
    <AuthContext.Provider value={{ user, token, userType, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### 4. Hook de Proteção (`src/hooks/useRequireAuth.ts`)

```typescript
export function useRequireAuth(
  redirectTo: string = '/login',
  requiredRole?: 'candidate' | 'company' | 'admin'
) {
  const router = useRouter();
  const { user, token, userType, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Não autenticado
    if (!isAuthenticated || !user || !token) {
      router.push(redirectTo);
      return;
    }

    // Token expirado
    if (isTokenExpired(token)) {
      logout();
      router.push(redirectTo);
      return;
    }

    // Role incorreta
    if (requiredRole && userType !== requiredRole) {
      router.push('/');
      return;
    }
  }, [user, token, userType, isAuthenticated]);

  return { user, token, userType };
}
```

---

## 🛡️ Middleware (Proteção Server-Side)

**Arquivo**: `middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWT, isTokenExpired } from './src/lib/jwt';

function getCookie(req: NextRequest, name: string) {
  return req.cookies.get(name)?.value;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rotas públicas
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/cadastro') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // Extrair token
  const token = getCookie(req, 'pcd_token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Validar token
  if (isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('pcd_token');
    response.cookies.delete('pcd_role');
    return response;
  }

  // Extrair role
  const decoded = decodeJWT(token);
  const userRole = decoded?.role;

  // Proteção por role
  if (pathname.startsWith('/admin') && userRole !== 'administrador') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/minhas-vagas') && userRole !== 'empresa') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 🔄 Mapeamento de Roles

| Backend       | Frontend    | Middleware       | Descrição |
|---------------|-------------|------------------|-----------|
| `candidato`   | `candidate` | `candidato`      | Pessoa com deficiência |
| `empresa`     | `company`   | `empresa`        | Empresa recrutadora |
| `administrador` | `admin`   | `administrador`  | Administrador da plataforma |

---

## 💡 Exemplos de Uso

### Proteger uma Página

```typescript
'use client';

import { useRequireAuth } from '@/src/hooks/useRequireAuth';

export default function MinhasVagasPage() {
  // Requer autenticação + role 'company'
  const { user } = useRequireAuth('/login', 'company');

  if (!user) return null; // Loading

  return <div>Minhas Vagas</div>;
}
```

### Fazer uma Requisição Autenticada

```typescript
import { getAuthHeaders } from '@/src/lib/api/apiClient';

async function createVaga(data) {
  const response = await fetch('http://localhost:3001/create/vaga', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    // Token inválido - fazer logout
    logout();
    router.push('/login');
    return;
  }

  return response.json();
}
```

### Verificar Expiração Manualmente

```typescript
import { isTokenExpired, getTokenInfo } from '@/src/lib/jwt';

const token = localStorage.getItem('@PCDentro:token');

if (isTokenExpired(token)) {
  console.log('Token expirado!');
  logout();
} else {
  const info = getTokenInfo(token);
  console.log('User ID:', info.id);
  console.log('Role:', info.role);
  console.log('Expira em:', new Date(info.exp * 1000));
}
```

---

## 🔒 Segurança

### Armazenamento

| Local | Dados | Propósito | Segurança |
|-------|-------|-----------|-----------|
| **localStorage** | `user`, `token`, `userType` | Requisições API client-side | ⚠️ Vulnerável a XSS |
| **Cookies** | `pcd_token`, `pcd_role` | Middleware server-side | ✅ Pode usar HttpOnly |

### Boas Práticas

✅ **Fazer**:
- Usar HTTPS em produção
- Configurar cookies com `HttpOnly`, `Secure`, `SameSite`
- Validar tokens no backend
- Usar tokens com tempo de expiração curto
- Implementar refresh tokens

❌ **Não fazer**:
- Armazenar senhas no frontend
- Confiar apenas em validação client-side
- Usar tokens sem expiração
- Expor secret keys no código

### Melhorias Futuras

- [ ] Cookies `HttpOnly` para tokens
- [ ] Refresh token automático
- [ ] Blacklist de tokens revogados
- [ ] Rate limiting de login
- [ ] 2FA (autenticação de dois fatores)

---

## 🐛 Troubleshooting

### Token Não Está Sendo Enviado

**Problema**: Header `Authorization` não aparece nas requisições

**Solução**:
```typescript
// Sempre use getAuthHeaders()
const response = await fetch(url, {
  headers: getAuthHeaders(), // ✅
});

// Não use headers vazios
const response = await fetch(url, {}); // ❌
```

### Redirect Loop no Middleware

**Problema**: Página fica redirecionando infinitamente

**Solução**: Adicione rotas públicas no middleware
```typescript
const publicRoutes = ['/', '/login', '/cadastro'];
if (publicRoutes.includes(pathname)) {
  return NextResponse.next();
}
```

### Token Expirando Muito Rápido

**Problema**: Usuário precisa fazer login toda hora

**Solução**: Aumente o tempo de expiração no backend ou implemente refresh token

---

## 📚 Referências

- [JWT.io](https://jwt.io/) - Debugger de JWT
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - Especificação JWT
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

[⬅️ Voltar: Arquitetura](./Arquitetura.md) | [➡️ Próximo: API](./API.md)

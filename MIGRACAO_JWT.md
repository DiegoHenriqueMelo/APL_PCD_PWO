# Migração para Autenticação JWT

## Resumo das Alterações

O sistema foi atualizado para usar autenticação baseada em **JWT (JSON Web Tokens)** em vez de secrets mockados. Agora, o backend retorna um token JWT no login que é usado para autenticar todas as requisições subsequentes.

---

## 📋 Estrutura de Resposta do Backend

### Login de Candidato/Empresa/Admin

```json
{
  "message": {
    "user": {
      "id": "CAND-148095",
      "cpf": "44405647801",
      "nome": "Diego Melo",
      "email": "example@gmail.com",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

O token JWT contém:
- `id`: ID do usuário
- `role`: Tipo de usuário (`candidato`, `empresa`, `administrador`)
- `iat`: Timestamp de emissão
- `exp`: Timestamp de expiração

---

## 🔧 Arquivos Criados

### 1. `src/lib/jwt.ts`
Biblioteca para decodificar e validar tokens JWT no client-side:
- `decodeJWT(token)` - Decodifica um token JWT
- `isTokenExpired(token)` - Verifica se o token expirou
- `getTokenInfo(token)` - Extrai informações do token

### 2. `src/lib/api/apiClient.ts`
Helper para requisições autenticadas:
- `getAuthToken()` - Obtém o token do localStorage
- `getAuthHeaders()` - Cria headers com autenticação
- `authenticatedFetch()` - Wrapper para fetch autenticado

### 3. `src/hooks/useRequireAuth.ts`
Hook React para proteção de rotas:
- Verifica autenticação
- Valida expiração do token
- Verifica role do usuário
- Redireciona se necessário

---

## 📝 Arquivos Modificados

### Middleware (`middleware.ts`)
**Antes:** Validava usando secrets mockados armazenados em cookies
```typescript
const SECRETS = {
  admin: 'qkwejfo2h3fu2h3pf92pfu9hfpuiw',
  company: 'tey2behTDI57eCOutO753ov7TV6rO',
  candidate: 'yVI7674i76rvOUYfov36tyrvOUTE',
};
```

**Depois:** Valida usando JWT token
```typescript
const token = getCookie(req, 'pcd_token');
const decoded = decodeJWT(token);
const userRole = decoded.role; // 'administrador', 'empresa', 'candidato'
```

### AuthContext (`src/contexts/AuthContext.tsx`)
**Antes:** Armazenava `pcd_role` e `pcd_secret` em cookies

**Depois:** Armazenava `pcd_token` e `pcd_role` em cookies
```typescript
document.cookie = `pcd_token=${authToken}; path=/; expires=${expires}`;
document.cookie = `pcd_role=${type}; path=/; expires=${expires}`;
```

### Páginas de Login

#### `app/login/page.tsx` (Candidato/Empresa)
**Mudança:** Agora processa `response.message.user` e `response.message.token`
```typescript
const { user: userData, token } = response.message;
login(formattedUser, token, tipoLogin === 'candidato' ? 'candidate' : 'company');
```

#### `app/login/admin/page.tsx`
**Mudança:** Processa token JWT retornado pelo backend
```typescript
const { user: userData, token } = response.message;
login(adminData, token, 'admin');
```

### Funções da API

Todas as funções de API foram atualizadas para usar `getAuthHeaders()` em vez de secrets:

#### Vagas
- ✅ `src/lib/api/vaga/createVaga.ts`
- ✅ `src/lib/api/vaga/deleteVaga.ts`
- ✅ `src/lib/api/vaga/getVagasByCompany.ts`
- ✅ `src/lib/api/vaga/getVagasByCandidate.ts`
- ✅ `src/lib/api/vaga/applyVaga.ts`

#### Candidato
- ✅ `src/lib/api/candidate/updateCandidate.ts`

#### Empresa
- ✅ `src/lib/api/empresa/updateCompany.ts`

#### Admin
- ✅ `src/lib/api/admin/getAnalitycs.ts`
- ✅ `src/lib/api/admin/createAcessibilidade.ts`
- ✅ `src/lib/api/admin/createBarreira.ts`
- ✅ `src/lib/api/admin/createSubTipo.ts`

---

## 🔐 Fluxo de Autenticação

### 1. Login
```
Usuário → Login Form → Backend
                         ↓
                    {user, token}
                         ↓
                    AuthContext
                         ↓
              localStorage + Cookies
```

### 2. Requisições Autenticadas
```
Cliente → getAuthHeaders()
            ↓
       Authorization: Bearer {token}
            ↓
        Backend API
```

### 3. Validação no Middleware
```
Request → middleware.ts
            ↓
       Extrai pcd_token
            ↓
       Decodifica JWT
            ↓
       Valida role
            ↓
     Permite/Redireciona
```

---

## 🚀 Como Usar

### Em uma requisição API:
```typescript
import { getAuthHeaders } from '@/src/lib/api/apiClient';

const response = await fetch('http://localhost:3001/api/endpoint', {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify(data),
});
```

### Em uma página protegida:
```typescript
import { useRequireAuth } from '@/src/hooks/useRequireAuth';

export default function ProtectedPage() {
  // Redireciona para /login se não autenticado
  const { user } = useRequireAuth();
  
  // Apenas usuários company
  const { user } = useRequireAuth('/login', 'company');
  
  return <div>Conteúdo protegido</div>;
}
```

### Verificar token expirado:
```typescript
import { isTokenExpired } from '@/src/lib/jwt';

if (isTokenExpired(token)) {
  logout();
  router.push('/login');
}
```

---

## 🔍 Mapeamento de Roles

| Backend    | Frontend   | Middleware |
|-----------|-----------|-----------|
| `candidato` | `candidate` | `candidato` |
| `empresa` | `company` | `empresa` |
| `administrador` | `admin` | `administrador` |

**Nota:** O middleware usa a role do JWT decodificado (formato do backend), enquanto o frontend usa tipos mais legíveis.

---

## ✅ Próximos Passos

1. **Testar o fluxo completo de login** para cada tipo de usuário
2. **Verificar se o backend está retornando o token JWT** no formato esperado
3. **Testar requisições autenticadas** para garantir que o header Authorization está sendo enviado
4. **Validar o middleware** para garantir proteção adequada das rotas
5. **Implementar refresh token** (se necessário para tokens de longa duração)
6. **Adicionar tratamento de erro 401** (token inválido/expirado) em todas as requisições

---

## 🐛 Debug

Para verificar o token JWT no console:
```javascript
import { decodeJWT, getTokenInfo } from '@/src/lib/jwt';

const token = localStorage.getItem('@PCDentro:token');
console.log('Token decodificado:', decodeJWT(token));
console.log('Info do token:', getTokenInfo(token));
```

Para verificar cookies no middleware:
```javascript
console.log('Token cookie:', getCookie(req, 'pcd_token'));
console.log('Role cookie:', getCookie(req, 'pcd_role'));
```

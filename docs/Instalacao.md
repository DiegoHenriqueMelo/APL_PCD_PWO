# 🚀 Guia de Instalação

Este guia vai te ajudar a configurar o PCDentro no seu ambiente local.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ **Node.js** 18.0 ou superior ([Download](https://nodejs.org/))
- ✅ **npm**, **pnpm** ou **yarn** (vem com Node.js)
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Editor de código** (recomendamos [VS Code](https://code.visualstudio.com/))

### Verificar Instalação

```bash
node --version  # Deve ser v18.0.0 ou superior
npm --version   # Qualquer versão recente
git --version   # Qualquer versão recente
```

---

## 🔧 Instalação Passo a Passo

### 1️⃣ Clone o Repositório

```bash
# HTTPS
git clone https://github.com/seu-usuario/pcdentro.git

# ou SSH
git clone git@github.com:seu-usuario/pcdentro.git

# Entre na pasta
cd pcdentro
```

### 2️⃣ Instale as Dependências

Escolha seu gerenciador de pacotes preferido:

**npm:**
```bash
npm install
```

**pnpm (recomendado - mais rápido):**
```bash
pnpm install
```

**yarn:**
```bash
yarn install
```

### 3️⃣ Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# URL do Frontend (para redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Ambiente
NODE_ENV=development
```

> ⚠️ **Importante**: Certifique-se de que o backend está rodando na porta 3001

### 4️⃣ Execute o Servidor de Desenvolvimento

```bash
npm run dev
# ou
pnpm dev
# ou
yarn dev
```

Você verá uma mensagem como:

```
▲ Next.js 15.5.6
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000

✓ Ready in 1.5s
```

### 5️⃣ Abra no Navegador

Acesse: **http://localhost:3000**

Você deve ver a landing page do PCDentro! 🎉

---

## 🏗️ Build para Produção

### Gerar Build Otimizado

```bash
npm run build
# ou
pnpm build
```

### Executar Build de Produção

```bash
npm run start
# ou
pnpm start
```

O servidor de produção rodará em `http://localhost:3000`.

---

## 🐳 Docker (Opcional)

Se preferir usar Docker:

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    image: seu-backend:latest
    ports:
      - "3001:3001"
```

### Executar com Docker

```bash
# Build
docker build -t pcdentro:latest .

# Run
docker run -p 3000:3000 pcdentro:latest

# Ou com docker-compose
docker-compose up
```

---

## 🔍 Verificando a Instalação

### Checklist

- [ ] Servidor rodando em `http://localhost:3000`
- [ ] Landing page carregando
- [ ] Console sem erros (F12 → Console)
- [ ] Links de navegação funcionando
- [ ] Página de login acessível

### Teste Rápido

1. **Acesse**: http://localhost:3000
2. **Clique**: "Login" no header
3. **Veja**: Formulário de login aparece
4. **Sucesso!** ✅

---

## 🐛 Problemas Comuns

### Erro: "Cannot find module"

**Solução**: Reinstale as dependências
```bash
rm -rf node_modules
rm package-lock.json  # ou pnpm-lock.yaml
npm install
```

### Erro: "Port 3000 is already in use"

**Solução**: Altere a porta
```bash
PORT=3001 npm run dev
```

Ou mate o processo na porta 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Erro: "API request failed"

**Solução**: Verifique se o backend está rodando
```bash
curl http://localhost:3001/health
# Deve retornar 200 OK
```

### Erro de CORS

**Solução**: Configure o backend para aceitar requisições do frontend
```javascript
// No backend (Express)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Erro: "Module not found: Can't resolve '@/...'"

**Solução**: Verifique o `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 📦 Estrutura de Pastas Após Instalação

```
pcdentro/
├── .next/              # Build do Next.js (gerado automaticamente)
├── node_modules/       # Dependências instaladas
├── app/                # Código-fonte da aplicação
├── src/                # Bibliotecas e utilitários
├── public/             # Assets estáticos
├── .env                # Variáveis de ambiente (você criou)
├── .gitignore          # Arquivos ignorados pelo Git
├── package.json        # Dependências do projeto
├── next.config.ts      # Configuração do Next.js
├── tsconfig.json       # Configuração do TypeScript
└── README.md           # Documentação principal
```

---

## 🎓 Extensões Recomendadas (VS Code)

Instale estas extensões para melhor experiência de desenvolvimento:

- **ES7+ React/Redux/React-Native snippets** - Snippets React
- **Tailwind CSS IntelliSense** - Autocomplete para Tailwind
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **TypeScript Vue Plugin (Volar)** - Suporte TypeScript
- **GitLens** - Git avançado

---

## ⚡ Configurações de Performance

### Acelerar o Build

```json
// next.config.ts
{
  "experimental": {
    "turbopack": true
  }
}
```

### Cache de Dependências

**npm:**
```bash
npm ci  # Instalação mais rápida em CI/CD
```

**pnpm:**
```bash
pnpm install --frozen-lockfile
```

---

## 🔄 Próximos Passos

Agora que você instalou o projeto:

1. **[Configuração Avançada](./Configuracao.md)** - Personalize o ambiente
2. **[Arquitetura](./Arquitetura.md)** - Entenda a estrutura do código
3. **[Autenticação](./Autenticacao.md)** - Configure login e JWT

---

## 🆘 Precisa de Ajuda?

- 📖 [FAQ](./FAQ.md)
- 🐛 [Reportar Bug](../../issues)
- 💬 [Discussões](../../discussions)

---

[⬅️ Voltar: Introdução](./Introducao.md) | [➡️ Próximo: Configuração](./Configuracao.md)

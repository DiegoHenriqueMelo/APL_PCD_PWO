# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **PCDentro**! Este guia vai te ajudar a fazer sua primeira contribuição.

---

## 🎯 Como Posso Contribuir?

### 🐛 Reportando Bugs

Encontrou um bug? Ajude-nos a melhorar!

1. **Verifique** se o bug já foi reportado em [Issues](../../issues)
2. **Abra uma nova issue** se necessário
3. **Use o template** de bug report
4. **Inclua**:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do Node.js e navegador
   - Console errors

**Exemplo de boa issue**:
```markdown
**Descrição**: Botão de candidatura não funciona em vagas desativadas

**Passos para reproduzir**:
1. Faça login como candidato
2. Acesse uma vaga desativada
3. Clique em "Candidatar-se"

**Esperado**: Mensagem de erro
**Atual**: Nada acontece

**Console Error**:
TypeError: Cannot read property 'status' of undefined
```

---

### 💡 Sugerindo Features

Tem uma ideia? Adoraríamos ouvir!

1. Abra uma **Discussion** ou **Issue**
2. Descreva:
   - Problema que resolve
   - Solução proposta
   - Alternativas consideradas
   - Mockups (se tiver)

---

### 💻 Contribuindo com Código

#### 1️⃣ Fork o Repositório

```bash
# Clique em "Fork" no GitHub, depois:
git clone https://github.com/SEU-USUARIO/pcdentro.git
cd pcdentro
```

#### 2️⃣ Crie uma Branch

Use o padrão de nomenclatura:
```bash
# Feature
git checkout -b feature/nome-da-feature

# Bugfix
git checkout -b fix/nome-do-bug

# Documentação
git checkout -b docs/descricao

# Exemplos
git checkout -b feature/dark-mode
git checkout -b fix/login-redirect-loop
git checkout -b docs/update-api-readme
```

#### 3️⃣ Faça suas Alterações

- Siga os [Padrões de Código](#-padrões-de-código)
- Adicione testes (quando aplicável)
- Atualize a documentação
- Teste localmente

#### 4️⃣ Commit suas Mudanças

Use **Conventional Commits**:

```bash
# Feature
git commit -m "feat: adiciona modo escuro"

# Bugfix
git commit -m "fix: corrige loop de redirect no login"

# Documentação
git commit -m "docs: atualiza guia de instalação"

# Refatoração
git commit -m "refactor: extrai lógica de auth para hook"

# Performance
git commit -m "perf: otimiza carregamento de vagas"

# Testes
git commit -m "test: adiciona testes para AuthContext"
```

**Tipos de commit**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem mudança de código)
- `refactor`: Refatoração
- `perf`: Melhoria de performance
- `test`: Testes
- `chore`: Tarefas de build, configs, etc

#### 5️⃣ Push para o GitHub

```bash
git push origin feature/nome-da-feature
```

#### 6️⃣ Abra um Pull Request

1. Vá para o repositório original
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Preencha o template:

```markdown
## Descrição
Breve descrição do que foi feito

## Tipo de Mudança
- [ ] Bugfix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots
(se aplicável)

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Sem conflitos com main
```

---

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ BOM: Use tipagem explícita
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User {
  // ...
}

// ❌ RUIM: Evite 'any'
function getUser(id: any): any {
  // ...
}
```

### React

```typescript
// ✅ BOM: Use function components
export default function MyComponent({ name }: { name: string }) {
  return <div>{name}</div>;
}

// ✅ BOM: Extraia lógica complexa para hooks
function useVagas() {
  const [vagas, setVagas] = useState([]);
  // ...
  return { vagas, loading, error };
}

// ❌ RUIM: Lógica complexa direto no component
export default function MyComponent() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(false);
  // ... 100 linhas de lógica
}
```

### Naming

```typescript
// ✅ BOM: Nomes descritivos
const isUserAuthenticated = true;
const fetchUserVagas = async () => {};

// ❌ RUIM: Nomes genéricos
const flag = true;
const getData = async () => {};
```

### Imports

```typescript
// ✅ BOM: Imports organizados
import { useState, useEffect } from 'react'; // React
import { useRouter } from 'next/navigation'; // Next
import { getVagas } from '@/src/lib/api/vaga/getVagas'; // Internal
import { Button } from '@/components/Button'; // Components

// ❌ RUIM: Imports desorganizados
import { Button } from '@/components/Button';
import { useState } from 'react';
import { getVagas } from '@/src/lib/api/vaga/getVagas';
import { useRouter } from 'next/navigation';
```

### CSS (Tailwind)

```tsx
// ✅ BOM: Classes organizadas
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">

// ❌ RUIM: Classes desorganizadas
<div className="shadow-md bg-white hover:shadow-lg rounded-lg p-4 transition flex items-center justify-between">
```

---

## 🧪 Testes

### Rodando Testes

```bash
# Todos os testes
npm test

# Modo watch
npm test -- --watch

# Cobertura
npm test -- --coverage
```

### Escrevendo Testes

```typescript
import { render, screen } from '@testing-library/react';
import { Login } from './page';

describe('Login Page', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('submits form with email and password', async () => {
    render(<Login />);
    // ... test logic
  });
});
```

---

## 📋 Checklist de PR

Antes de abrir um PR, verifique:

- [ ] Código compila sem erros (`npm run build`)
- [ ] Não há erros de lint
- [ ] Testes estão passando
- [ ] Adicionei testes para novas features
- [ ] Atualizei a documentação
- [ ] Commits seguem Conventional Commits
- [ ] Branch está atualizada com `main`
- [ ] Descrição do PR está completa

---

## 🏷️ Labels

Usamos estas labels nas issues/PRs:

- `bug` - Algo não está funcionando
- `enhancement` - Nova feature ou melhoria
- `documentation` - Melhorias na documentação
- `good first issue` - Boa para iniciantes
- `help wanted` - Precisa de ajuda da comunidade
- `priority: high` - Alta prioridade
- `priority: low` - Baixa prioridade
- `wontfix` - Não será implementado

---

## 🌳 Estrutura de Branches

```
main (produção)
  └── develop (desenvolvimento)
       ├── feature/dark-mode
       ├── feature/notifications
       ├── fix/login-bug
       └── docs/update-readme
```

- `main`: Código em produção (protegida)
- `develop`: Desenvolvimento ativo
- `feature/*`: Novas funcionalidades
- `fix/*`: Correções de bugs
- `docs/*`: Documentação

---

## 💬 Código de Conduta

### Nossos Padrões

**Comportamento Esperado** ✅:
- Respeito e empatia
- Feedback construtivo
- Foco no que é melhor para a comunidade
- Aceitação de críticas

**Comportamento Inaceitável** ❌:
- Assédio ou discriminação
- Comentários ofensivos
- Spam ou trolling

### Aplicação

Violações podem resultar em:
1. Aviso
2. Suspensão temporária
3. Ban permanente

Reporte comportamento inadequado para: suporte@pcdentro.com

---

## 📞 Comunicação

- **Issues**: Bugs e features
- **Discussions**: Ideias e perguntas
- **PR Reviews**: Feedback de código
- **Email**: suporte@pcdentro.com

---

## 🎓 Recursos para Iniciantes

Primeira vez contribuindo? Confira:

- [Como fazer um Fork](https://docs.github.com/pt/get-started/quickstart/fork-a-repo)
- [Como criar um PR](https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Guia de TypeScript](https://www.typescriptlang.org/docs/)

---

## 🏆 Reconhecimento

Contribuidores são reconhecidos:
- README (seção Contributors)
- Release notes
- Agradecimentos especiais

---

## ❓ Dúvidas?

- 📖 Leia a [Documentação](./Home.md)
- 💬 Abra uma [Discussion](../../discussions)
- 📧 Email: dev@pcdentro.com

---

**Obrigado por contribuir!** Sua ajuda faz a diferença na vida de pessoas com deficiência. 💙

[⬅️ Voltar para Home](./Home.md)

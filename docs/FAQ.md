# ❓ FAQ - Perguntas Frequentes

Respostas para as dúvidas mais comuns sobre o **PCDentro**.

---

## 🚀 Instalação & Configuração

### Como faço para rodar o projeto localmente?

Siga o [Guia de Instalação](./Instalacao.md). Basicamente:
```bash
git clone https://github.com/seu-usuario/pcdentro.git
cd pcdentro
npm install
npm run dev
```

### Qual a versão mínima do Node.js necessária?

**Node.js 18.0 ou superior**. Verifique com:
```bash
node --version
```

### O projeto funciona com npm, yarn ou pnpm?

Sim! Funciona com qualquer um dos três. Recomendamos **pnpm** por ser mais rápido.

### Preciso do backend rodando?

**Sim**. O frontend se conecta à API em `http://localhost:3001`. Certifique-se de que o backend está rodando.

### Como configuro as variáveis de ambiente?

Crie um arquivo `.env` na raiz:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔐 Autenticação

### Como funciona o sistema de login?

Usamos **JWT (JSON Web Tokens)**. O backend retorna um token no login que é usado para autenticar todas as requisições subsequentes. Veja detalhes em [Autenticação](./Autenticacao.md).

### Onde o token é armazenado?

Em **dois lugares**:
- **localStorage**: Para uso em requisições API client-side
- **Cookies**: Para validação no middleware server-side

### Por que meu token expira tão rápido?

O tempo de expiração é configurado no **backend**. Entre em contato com o administrador da API para aumentar o `exp` do token.

### Como faço logout?

```typescript
import { useAuth } from '@/src/contexts/AuthContext';

const { logout } = useAuth();
logout(); // Remove token e redireciona
```

### Posso ter vários usuários logados ao mesmo tempo?

Não no mesmo navegador. O sistema usa `localStorage` global. Para múltiplos usuários, use:
- Navegadores diferentes
- Janelas anônimas
- Perfis diferentes do Chrome

---

## 🏢 Empresas

### Como crio uma vaga?

1. Faça login como **empresa**
2. Vá para `/vaga/create`
3. Preencha o formulário
4. Selecione tipos de deficiência aceitos
5. Clique em "Publicar Vaga"

### Posso editar uma vaga depois de criada?

Atualmente **não**. Esta funcionalidade está no roadmap. Você pode deletar e recriar a vaga.

### Como vejo as candidaturas recebidas?

Em desenvolvimento. Atualmente, as candidaturas são registradas no backend, mas a visualização no frontend ainda não foi implementada.

### Quantas vagas posso criar?

**Ilimitadas**. Não há restrição no frontend.

---

## 👤 Candidatos

### Como me candidato a uma vaga?

1. Faça login como **candidato**
2. Acesse `/vaga`
3. Veja a lista de vagas (filtradas por sua deficiência)
4. Clique em uma vaga
5. Clique em "Candidatar-se"

### Por que vejo apenas algumas vagas?

As vagas são **filtradas automaticamente** pelo seu tipo de deficiência. Você só vê vagas compatíveis com sua necessidade. Isso garante que todas as vagas exibidas são realmente acessíveis para você.

### Como funciona o filtro de vagas?

Se você tem deficiência `DVISU-0001` (Visual):
- O sistema extrai o prefixo: `DVISU`
- Filtra vagas que aceitam `DVISU`
- Você vê apenas vagas compatíveis

### Posso me candidatar a vagas de outros tipos de deficiência?

Não diretamente pelo sistema. O filtro é automático para garantir que você veja apenas vagas adequadas.

### Como atualizo meu perfil?

Vá para `/perfil/editar` e atualize suas informações.

---

## 🔧 Administração

### Como acesso o painel administrativo?

Faça login em `/login/admin` com credenciais de administrador. Depois acesse `/admin`.

### O que posso fazer como admin?

- Ver analytics da plataforma
- Criar categorias (tipos de deficiência, barreiras, recursos)
- Gerenciar usuários (futuro)
- Gerar relatórios (futuro)

---

## 🐛 Problemas Comuns

### Erro: "Cannot find module"

**Solução**: Reinstale as dependências
```bash
rm -rf node_modules
npm install
```

### Erro: "Port 3000 is already in use"

**Solução**: Mate o processo na porta 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Erro: "API request failed"

**Causas comuns**:
1. Backend não está rodando
2. URL da API incorreta no `.env`
3. CORS não configurado no backend

**Solução**: Verifique se o backend está em `http://localhost:3001`

### Erro: "Token inválido"

**Causas**:
1. Token expirado
2. Token foi modificado
3. Secret key diferente entre frontend e backend

**Solução**: Faça logout e login novamente

### Não consigo fazer login

**Verifique**:
1. Email e senha estão corretos
2. Backend está rodando
3. Endpoint de login correto (`/login/candidato`, `/login/empresa`, `/login/admin`)
4. Console do navegador para erros (F12)

### As vagas não aparecem

**Verifique**:
1. Você está logado como candidato
2. Existem vagas compatíveis com sua deficiência
3. Console do navegador (F12) para erros
4. Network tab para ver a resposta da API

### Modal não fecha

**Solução**: Clique no X ou fora do modal. Se persistir, atualize a página (F5).

### Formulário não envia

**Verifique**:
1. Todos os campos obrigatórios estão preenchidos
2. Email está no formato correto
3. Senhas coincidem
4. Console para erros de validação

---

## 🎨 Interface

### Como mudo as cores do tema?

As cores estão definidas em `app/globals.css` e inline nos componentes. Atualmente não há suporte a temas personalizados.

### A interface é responsiva?

**Sim!** Funciona em desktop, tablet e mobile.

### Posso usar modo escuro?

Ainda não implementado. Está no roadmap.

---

## 🚀 Performance

### O site está lento, como acelero?

**Dicas**:
- Use `pnpm` em vez de `npm` (build mais rápido)
- Rode `npm run build` para versão otimizada
- Verifique se o backend não está lento
- Limpe o cache do navegador

### Quanto tempo demora o build?

Com **Turbopack**: ~5-10 segundos  
Sem Turbopack: ~30-60 segundos

---

## 📱 Mobile

### Existe app mobile?

Ainda não. Está planejado para o futuro com **React Native**.

### Posso acessar pelo celular?

Sim! Acesse pelo navegador mobile. A interface é responsiva.

---

## 🤝 Contribuição

### Como contribuo com o projeto?

Veja o [Guia de Contribuição](./Contribuindo.md).

### Encontrei um bug, o que faço?

Abra uma [issue no GitHub](../../issues) com:
- Descrição do bug
- Passos para reproduzir
- Screenshots (se aplicável)
- Console errors

### Tenho uma ideia de feature

Abra uma [issue](../../issues) ou [discussion](../../discussions) descrevendo sua ideia!

---

## 🔒 Segurança

### O sistema é seguro?

Usamos **JWT** para autenticação e validação server-side com middleware. Veja mais em [Segurança](./Seguranca.md).

### Meus dados estão protegidos?

Sim, mas lembre-se:
- **Não compartilhe** seu token
- Use **HTTPS** em produção
- Faça **logout** em computadores públicos

### Posso usar em produção?

Recomendamos implementar as melhorias de segurança documentadas no [Relatório de QA](../relatorio_qa_pcdentro.md) antes de produção.

---

## 📚 Documentação

### Onde encontro mais informações?

- [Introdução](./Introducao.md)
- [Guia de Instalação](./Instalacao.md)
- [Arquitetura](./Arquitetura.md)
- [Autenticação](./Autenticacao.md)
- [API](./API.md)

### A documentação está desatualizada

Abra uma [issue](../../issues) ou faça um [pull request](../../pulls) com as correções!

---

## 🆘 Ainda tem dúvidas?

- 📧 Email: suporte@pcdentro.com
- 💬 [GitHub Discussions](../../discussions)
- 🐛 [Reportar Bug](../../issues)

---

[⬅️ Voltar para Home](./Home.md)

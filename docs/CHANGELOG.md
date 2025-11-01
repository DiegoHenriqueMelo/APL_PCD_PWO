# 📝 CHANGELOG

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### 🚀 Em Desenvolvimento
- Sistema de notificações em tempo real
- Chat entre empresa e candidato
- Upload de currículo em PDF
- Testes automatizados (Jest + React Testing Library)
- Internacionalização (i18n)

---

## [0.2.0] - 2025-11-01

### ✨ Adicionado
- **Filtro Inteligente de Vagas**: Sistema que filtra vagas por tipo de deficiência usando apenas prefixos (DMOTO, DVISU, DAUDI)
- **Documentação Completa**: README profissional e Wiki do GitHub
- **Guias de Contribuição**: Padrões de código e workflow
- **FAQ**: Perguntas frequentes

### 🔧 Modificado
- Melhorado algoritmo de filtro de vagas para ignorar números e hífens
- Atualizada estrutura de resposta da API para suportar múltiplos formatos
- Refatorado código de filtro para ser mais robusto

### 🐛 Corrigido
- Filtro de vagas não funcionando quando API retorna formato `{data: [...], total: X}`
- Vagas não sendo exibidas devido a inconsistência na estrutura de dados
- Logs de debug melhorados para facilitar troubleshooting

---

## [0.1.0] - 2025-10-15

### ✨ Adicionado
- **Sistema de Autenticação JWT**: Substituição completa do sistema de secrets mockados
- **Middleware de Proteção**: Validação server-side de rotas
- **AuthContext**: Gerenciamento global de autenticação
- **useRequireAuth Hook**: Proteção client-side de páginas
- **API Client**: Helper para requisições autenticadas
- **JWT Utilities**: Funções para decodificar e validar tokens

### 📚 Documentação
- Guia de Migração JWT (`MIGRACAO_JWT.md`)
- Exemplos de Uso JWT (`EXEMPLOS_JWT.md`)
- Relatório de QA completo (`relatorio_qa_pcdentro.md`)

### 🔧 Modificado
- Todas as páginas de login agora processam tokens JWT
- Todas as funções de API usam autenticação Bearer
- Middleware valida tokens em vez de secrets
- Cookies agora armazenam tokens JWT

### 🗑️ Removido
- Sistema de secrets mockados
- Validação baseada em `x-pcd-secret` headers

---

## [0.0.1] - 2025-09-01

### ✨ Inicial
- Estrutura base do projeto Next.js 15
- Páginas de login (candidato, empresa, admin)
- Página de cadastro
- Sistema de vagas (listagem, criação, candidatura)
- Perfil editável
- Painel administrativo
- Interface com Tailwind CSS
- Integração com API backend

### 🎨 UI/UX
- Landing page responsiva
- Design system com cores acessíveis
- Modais para detalhes de vagas
- Formulários completos
- Loading states

### 🏗️ Arquitetura
- App Router (Next.js 15)
- TypeScript
- Context API para estado global
- Estrutura modular de pastas
- API layer organizada

---

## Tipos de Mudanças

- `✨ Adicionado` - Novas features
- `🔧 Modificado` - Mudanças em features existentes
- `🗑️ Removido` - Features removidas
- `🐛 Corrigido` - Correções de bugs
- `🔒 Segurança` - Melhorias de segurança
- `📚 Documentação` - Mudanças na documentação
- `⚡ Performance` - Melhorias de performance
- `🎨 UI/UX` - Melhorias visuais
- `🏗️ Arquitetura` - Mudanças estruturais

---

## Como Contribuir com o Changelog

Ao fazer um PR, adicione suas mudanças em `[Unreleased]`:

```markdown
## [Unreleased]

### ✨ Adicionado
- Sua nova feature aqui

### 🐛 Corrigido
- Seu bugfix aqui
```

Mantenedores moverão as mudanças para uma versão numerada no release.

---

[⬅️ Voltar para Home](./Home.md)

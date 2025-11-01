# 📖 Como Publicar a Wiki no GitHub

Este guia mostra como publicar toda a documentação criada como Wiki oficial do seu repositório no GitHub.

---

## 🎯 Método 1: Interface Web (Mais Fácil)

### Passo 1: Habilitar Wiki

1. Acesse seu repositório no GitHub
2. Clique na aba **Settings** (Configurações)
3. Role até a seção **Features**
4. Marque ✅ **Wikis**
5. Salve

### Passo 2: Criar Página Inicial

1. Clique na aba **Wiki** (apareceu no topo)
2. Clique em **Create the first page**
3. Deixe o título como **Home**
4. Abra o arquivo `docs/Home.md` localmente
5. Copie **todo o conteúdo**
6. Cole na Wiki
7. Clique em **Save Page**

### Passo 3: Criar Páginas Restantes

Para cada arquivo em `/docs`, repita:

1. Na Wiki, clique em **New Page**
2. Título: Nome do arquivo sem `.md`
3. Conteúdo: Cole o conteúdo do arquivo
4. Clique em **Save Page**

**Páginas para criar:**

- [ ] **Introducao** ← `docs/Introducao.md`
- [ ] **Instalacao** ← `docs/Instalacao.md`
- [ ] **Arquitetura** ← `docs/Arquitetura.md`
- [ ] **Autenticacao** ← `docs/Autenticacao.md`
- [ ] **FAQ** ← `docs/FAQ.md`
- [ ] **Contribuindo** ← `docs/Contribuindo.md`
- [ ] **CHANGELOG** ← `docs/CHANGELOG.md`

### Passo 4: Criar Sidebar (Opcional)

1. Na Wiki, clique em **New Page**
2. Título: **_Sidebar** (exatamente assim, com underscore)
3. Cole este conteúdo:

```markdown
### 🚀 Começando
- [Home](Home)
- [Introdução](Introducao)
- [Instalação](Instalacao)

### 🏗️ Arquitetura
- [Arquitetura](Arquitetura)
- [Autenticação](Autenticacao)

### 📚 Referência
- [FAQ](FAQ)
- [CHANGELOG](CHANGELOG)

### 🤝 Contribuição
- [Como Contribuir](Contribuindo)
```

4. Salve

---

## 🎯 Método 2: Git (Mais Rápido)

### Passo 1: Clone a Wiki

```bash
# Navegue até uma pasta fora do projeto
cd ..

# Clone o repositório Wiki (substitua seu-usuario/pcdentro)
git clone https://github.com/seu-usuario/pcdentro.wiki.git
cd pcdentro.wiki
```

### Passo 2: Copie os Arquivos

```bash
# Volte para a pasta do projeto
cd ../pcdentro

# Copie todos os arquivos .md de docs/ para wiki/
cp docs/*.md ../pcdentro.wiki/

# Renomeie WIKI_HOME.md para Home.md
cd ../pcdentro.wiki
mv WIKI_HOME.md Home.md
```

### Passo 3: Remova Arquivos Desnecessários

```bash
# Remove o resumo (não é necessário na Wiki)
rm RESUMO_DOCUMENTACAO.md

# Se existir, remova README.md da wiki
rm README.md 2>/dev/null || true
```

### Passo 4: Commit e Push

```bash
# Adicione todos os arquivos
git add .

# Commit
git commit -m "docs: adiciona documentação completa do projeto"

# Push para o GitHub
git push origin master
```

### Passo 5: Verifique

Acesse: `https://github.com/seu-usuario/pcdentro/wiki`

Todas as páginas devem aparecer! 🎉

---

## 📝 Estrutura Final da Wiki

Após publicar, sua Wiki terá:

```
https://github.com/seu-usuario/pcdentro/wiki

├── Home                    (Página inicial)
├── Introducao              (Sobre o projeto)
├── Instalacao              (Como instalar)
├── Arquitetura             (Estrutura técnica)
├── Autenticacao            (Sistema JWT)
├── FAQ                     (Perguntas frequentes)
├── Contribuindo            (Como contribuir)
├── CHANGELOG               (Histórico)
└── _Sidebar (opcional)     (Menu lateral)
```

---

## 🔗 Links Internos

A Wiki do GitHub automaticamente converte links no formato:

```markdown
[Texto do Link](Nome-da-Pagina)
```

**Exemplos:**
- `[Instalação](Instalacao)` → Link para página Instalacao
- `[FAQ](FAQ)` → Link para página FAQ
- `[Home](Home)` → Link para Home

---

## 🎨 Formatação na Wiki

A Wiki suporta:

- ✅ **Markdown** completo
- ✅ **Mermaid** (diagramas)
- ✅ **Code blocks** com syntax highlighting
- ✅ **Tabelas**
- ✅ **Imagens** (via upload ou URL)
- ✅ **Emojis** 🎉

---

## 📸 Adicionar Imagens na Wiki

### Método 1: Upload Direto

1. Edite uma página da Wiki
2. Arraste uma imagem para o editor
3. A imagem é automaticamente hospedada

### Método 2: URL Externa

```markdown
![Alt text](https://link-da-imagem.com/imagem.png)
```

### Método 3: Imagens no Repo

1. Crie pasta `docs/images/` no repo
2. Adicione imagens
3. Referencie na Wiki:

```markdown
![Screenshot](https://raw.githubusercontent.com/seu-usuario/pcdentro/main/docs/images/screenshot.png)
```

---

## 🔧 Manutenção da Wiki

### Atualizar uma Página

**Via Web:**
1. Vá até a página
2. Clique em **Edit**
3. Faça as mudanças
4. **Save Page**

**Via Git:**
```bash
cd pcdentro.wiki
# Edite o arquivo .md
git add .
git commit -m "docs: atualiza página X"
git push
```

### Sincronizar Docs → Wiki

Quando atualizar `/docs` no projeto:

```bash
# No projeto
cd pcdentro

# Copie para wiki
cp docs/*.md ../pcdentro.wiki/
cd ../pcdentro.wiki
mv WIKI_HOME.md Home.md

# Commit
git add .
git commit -m "docs: sincroniza com repo principal"
git push
```

---

## 🚀 Dicas Pro

### 1. Link no README para Wiki

No seu `README.md`, adicione:

```markdown
📖 **[Ver documentação completa na Wiki →](../../wiki)**
```

### 2. Adicione Badge

```markdown
[![Wiki](https://img.shields.io/badge/docs-wiki-blue)](../../wiki)
```

### 3. Footer em Todas as Páginas

Adicione no final de cada página:

```markdown
---
[⬅️ Voltar para Home](Home) | [📖 Ver todas as páginas](../../wiki/_pages)
```

### 4. Índice Automático

No topo de páginas longas:

```markdown
## 📋 Índice

- [Seção 1](#seção-1)
- [Seção 2](#seção-2)
- [Seção 3](#seção-3)
```

---

## ✅ Checklist de Publicação

- [ ] Habilitei a Wiki no Settings
- [ ] Criei página Home
- [ ] Criei todas as páginas de docs/
- [ ] Testei links internos
- [ ] Adicionei _Sidebar
- [ ] Linkei Wiki no README
- [ ] Testei visualização no mobile
- [ ] Revisão ortográfica

---

## 🎉 Pronto!

Sua Wiki está publicada e acessível em:

```
https://github.com/SEU-USUARIO/pcdentro/wiki
```

Compartilhe com a equipe e contribuidores! 🚀

---

## 🆘 Problemas Comuns

### Wiki não aparece
- ✅ Verifique se está habilitada em Settings → Features

### Links quebrados
- ✅ Use nomes exatos das páginas (case-sensitive)
- ✅ Formato: `[Texto](Nome-da-Pagina)` sem `.md`

### Imagens não aparecem
- ✅ Use URLs completas
- ✅ Ou faça upload direto na Wiki

### Formatação quebrada
- ✅ Teste em preview antes de salvar
- ✅ Verifique code blocks (triplo backtick)

---

**Boa sorte com sua Wiki profissional!** 📚✨

[⬅️ Voltar para Resumo](RESUMO_DOCUMENTACAO.md)

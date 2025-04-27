# Deploy Next.js no GitHub Pages (`aposta-data-vs`)

## 1. Configuração do Projeto

Edite o arquivo `next.config.mjs` e adicione as seguintes opções ao objeto de configuração:

```js
const nextConfig = {
  output: 'export',
  basePath: '/aposta-data-vs',
  assetPrefix: '/aposta-data-vs/',
  // ...outras opções já existentes
}
```

## 2. Script de Exportação

No `package.json`, adicione o script:

```json
"export": "next build && next export"
```

## 3. Exportação Estática

Execute:

```bash
pnpm install
pnpm export
```

O conteúdo exportado estará na pasta `out/`.

## 4. Publicação no GitHub

- Faça commit das alterações e envie para o repositório:  
  `https://github.com/fbiluoficial/aposta-data-vs`

- Ative o GitHub Pages nas configurações do repositório, apontando para a branch `main` e a pasta `/out`.

## 5. Acesso

O site estará disponível em:  
[https://fbiluoficial.github.io/aposta-data-vs/](https://fbiluoficial.github.io/aposta-data-vs/)

---

**Observações:**
- Certifique-se de que todas as rotas e assets funcionam em modo estático.
- Para deploy automático, pode-se configurar um workflow do GitHub Actions para rodar o export e publicar a pasta `out/` na branch main.
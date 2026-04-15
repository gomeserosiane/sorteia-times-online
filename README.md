# Sorteador de Times - versão compatível com Vercel

## O que é
Projeto 100% front-end, sem Node/Express no servidor, pronto para deploy na Vercel.

## Login
- Login: `admin`
- Senha: `2026`

## Como rodar localmente
Você pode simplesmente abrir o `index.html` no navegador.

Se quiser rodar com servidor local:

```bash
npm install
npm run dev
```

## Deploy na Vercel
1. Envie essa pasta para um repositório no GitHub.
2. Importe o repositório na Vercel.
3. Framework preset: `Other`.
4. Não precisa configurar build command.
5. Output directory: deixe em branco.
6. Deploy.

## Estrutura
- `index.html` -> interface
- `styles.css` -> visual e animações
- `app.js` -> login, parser, sorteio e exportações
- `vercel.json` -> ajustes simples de deploy

## Formato da lista
O sistema procura os nomes após a palavra `lista`, no padrão:

```text
lista
1-João
2-Maria
3-Carlos
4-Pedro
```

# Project omin

Sistema Monorepo contendo as aplicações **back** (Node.js + Express + TypeScript + MongoDB) e **front** (Next.js App Router + React + TypeScript + Tailwind CSS).

## Estrutura do Monorepo

```text
omin/
├── back/     # API Node.js com Express, TypeScript, Mongoose e Jest
├── front/    # Aplicação Web com Next.js (App Router), React e Tailwind CSS
├── docker-compose.yml
└── package.json
```

## Como Executar

### Pré-requisitos
- Node.js (v18+) ou Bun
- MongoDB (local ou URI Atlas)
- Docker (Opcional)

### Desenvolvimento Local

1. Instale as dependências na raiz:
```bash
npm install
```

2. Configure as variáveis de ambiente:
- Crie `back/.env` a partir de `back/.env.example`
- Crie `front/.env` a partir de `front/.env.example`

3. Inicie os projetos simultaneamente:
```bash
npm run dev
```

### Com Docker

Para subir a infraestrutura completa via Docker Compose:
```bash
docker-compose up --build
```

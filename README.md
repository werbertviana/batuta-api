# Node + Express + Prisma + Postgres (Docker) — Template

## Requisitos
- Node 20+
- Docker + Docker Compose

## 1) Subir banco + API via Docker
```bash
cp .env.example .env
docker compose up --build
```

API: http://localhost:3000  
Health: http://localhost:3000/health  
Users: http://localhost:3000/api/users

> Observação: o container da API usa `DATABASE_URL` apontando para o service `db`.

## 2) Rodar local (sem container da API)
1. Suba só o banco:
```bash
docker compose up -d db
```

2. Instale deps e gere Prisma:
```bash
npm i
cp .env.example .env
npm run prisma:generate
```

3. Rode as migrations:
```bash
npm run prisma:migrate
```

4. Rode em dev:
```bash
npm run dev
```

## Estrutura de pastas
- `src/app.ts` (middlewares + routes)
- `src/routes/index.ts` (router principal /api)
- `src/shared/*` (env, prisma client, errors)
- `src/modules/<modulo>/{controller,service,repository,routes,types}.ts`

## Próximo passo
Me envie como vai ser o banco no futuro (tabelas/relacionamentos) que eu atualizo `prisma/schema.prisma` no mesmo padrão.

# ---------- build ----------
FROM node:20-bullseye-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm i

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- runtime ----------
FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production

# garante libs necessárias (inclui libssl1.1 no bullseye)
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/server.js"]

FROM node:24-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile --filter api...

ENV API_PORT=4000
EXPOSE 4000

CMD ["pnpm", "--filter", "api", "start"]

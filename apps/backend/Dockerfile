FROM node:22-alpine
WORKDIR /usr/src/app

# Корректный pnpm через corepack
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Обновляем пакеты базового образа до последних патчей безопасности
RUN apk --no-cache upgrade

# Ничего лишнего не ставим на этапе сборки — в dev всё поставим при старте
COPY package*.json ./
# (опционально) RUN pnpm fetch   # прогреет кеш, если не монтируешь код

COPY . .
EXPOSE 4000
CMD ["pnpm","dev"]

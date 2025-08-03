FROM node:18-alpine

WORKDIR /app

# Установка pnpm
RUN npm install -g pnpm

# Копирование файлов зависимостей
COPY package.json pnpm-lock.yaml* ./

# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN pnpm run build

# Удаление dev зависимостей
RUN pnpm prune --prod

EXPOSE 8083

CMD ["pnpm", "run", "start:prod"]

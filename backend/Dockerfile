# 1. Базовый образ
FROM node:20

# 2. Рабочая директория
WORKDIR /app

# 3. Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --production

# 4. Копируем весь код
COPY . .

# 5. Указываем порт
EXPOSE 1338

# 6. Запуск Strapi
CMD ["npm", "run", "start"]
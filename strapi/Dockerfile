FROM node:20-alpine
WORKDIR /opt/app

ENV NODE_ENV=production

# устанавливаем зависимости
COPY package.json yarn.lock* package-lock.json* ./
RUN npm install

# копируем весь проект
COPY . .

# билдим админку strapi
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]

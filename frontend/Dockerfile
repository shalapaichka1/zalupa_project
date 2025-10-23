FROM node:22 AS build
WORKDIR /app

COPY package*.json ./

# Устанавливаем все зависимости, включая devDependencies
RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
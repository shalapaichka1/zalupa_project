# 1) build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install
COPY . .
RUN npm run build

# 2) run stage (nginx)
FROM nginx:1.27-alpine
# Кладем собранную статику
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx конфиг прокидываем через docker-compose volume (в compose)

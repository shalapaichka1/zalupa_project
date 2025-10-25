# build stage
FROM node:20-alpine AS build
WORKDIR /app

# принимаем переменные из docker-compose
ARG VITE_BACKEND_URL_API
ARG VITE_BACKEND_REGISTER_API
ARG VITE_BACKEND_YOUTUBE_API_KEY

COPY package*.json ./
RUN npm install

COPY . .

# передаем их в окружение перед сборкой
ENV VITE_BACKEND_URL_API=$VITE_BACKEND_URL_API
ENV VITE_BACKEND_REGISTER_API=$VITE_BACKEND_REGISTER_API
ENV VITE_BACKEND_YOUTUBE_API_KEY=$VITE_BACKEND_YOUTUBE_API_KEY

RUN npm run build

# run stage
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
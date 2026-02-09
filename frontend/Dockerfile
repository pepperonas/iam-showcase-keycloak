# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_KEYCLOAK_URL=http://localhost:8180
ARG VITE_KEYCLOAK_REALM=iam-showcase
ARG VITE_KEYCLOAK_CLIENT_ID=iam-frontend
ARG VITE_API_BASE_URL=http://localhost:8080/api/v1

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

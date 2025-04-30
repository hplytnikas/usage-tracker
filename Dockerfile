# Stage 1: Build the app
FROM node:slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with a static server
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: replace default nginx config
# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
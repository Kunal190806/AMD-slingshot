# Stage 1: Build the optimized Vite SPA
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency graphs and install
COPY package.json package-lock.json* ./
RUN npm ci

# Copy full source and trigger terser build
COPY . .
RUN npm run build

# Stage 2: Serve via Nginx (Lightweight)
FROM nginx:alpine

# Copy the minified dist output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Patch Nginx default config to support SPA fallback routing natively
RUN sed -i 's/index  index.html index.htm;/index  index.html index.htm;\n        try_files $uri $uri\/ \/index.html;/' /etc/nginx/conf.d/default.conf

# Cloud Run explicitly expects containers to listen on $PORT (defaults to 8080)
ENV PORT 8080
EXPOSE 8080

# Dynamically patch Nginx to listen on the expected Cloud Run port at runtime before launching
CMD sed -i -e 's/listen       80;/listen       '"$PORT"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

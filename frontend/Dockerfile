# -------- Build stage --------
FROM node:20-alpine AS build

WORKDIR /app
<<<<<<< HEAD
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000 && \
    npm install --verbose
=======

# Make npm more reliable on flaky networks
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

# Install dependencies
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy source
>>>>>>> 2768a0969cea8d8c4e78c7808e51f9226fcbb3bf
COPY . .

# Build-time API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build


# -------- Runtime stage --------
FROM nginx:stable-alpine

# SPA routing support
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

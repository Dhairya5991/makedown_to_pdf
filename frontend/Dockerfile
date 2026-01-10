# -------- Build stage --------
FROM node:20-alpine AS build

WORKDIR /app

# Make npm more reliable on flaky networks
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

# Install dependencies
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy source
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

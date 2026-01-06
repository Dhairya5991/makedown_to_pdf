FROM ghcr.io/puppeteer/puppeteer:22

USER root
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies (skipping chromium download as it's in the base image)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN npm install

# Copy source
COPY src ./src

# Create data directory
RUN mkdir -p ./data

# Environment variables
ENV PORT=8080
ENV FRONTEND_URL=http://localhost:3000
ENV SESSION_SECRET=change_me
ENV ALLOW_DEV_LOGIN=true

EXPOSE 8080

CMD ["node", "src/server.js"]

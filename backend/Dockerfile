FROM ghcr.io/puppeteer/puppeteer:22

USER root
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-timeout 300000 && \
    npm install --verbose

COPY src ./src

RUN mkdir -p ./data

ENV PORT=8080
ENV FRONTEND_URL=http://localhost:3000
ENV SESSION_SECRET=change_me
ENV ALLOW_DEV_LOGIN=true

EXPOSE 8080

CMD ["node", "src/server.js"]

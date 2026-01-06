FROM node:20-bullseye
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci || npm install
COPY src ./src
COPY data ./data
ENV PORT=8080
ENV FRONTEND_URL=http://localhost:3000
ENV SESSION_SECRET=change_me
ENV ALLOW_DEV_LOGIN=true
EXPOSE 8080
CMD ["node", "src/server.js"]

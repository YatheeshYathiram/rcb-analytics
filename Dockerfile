# ---- Stage 1: Build the React (Vite) frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Backend runtime, serving the built frontend as static files ----
FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./
# Built frontend assets land in ./public, served by server.js
COPY --from=frontend-build /app/frontend/dist ./public

ENV NODE_ENV=production
# Cloud Run injects PORT (defaults to 8080); server.js reads process.env.PORT
EXPOSE 8080

CMD ["node", "server.js"]

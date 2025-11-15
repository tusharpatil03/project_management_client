## Stage 1: build
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 \
  build-essential \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies using npm ci for reproducible installs
RUN npm ci --prefer-offline --progress=false

# Copy source and build
COPY . .
ARG VITE_PUBLIC_PATH=/
ENV VITE_PUBLIC_PATH=$VITE_PUBLIC_PATH
RUN npm run build

## Stage 2: production image
FROM nginx:stable-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing (all routes → index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
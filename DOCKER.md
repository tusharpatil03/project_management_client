# Dockerizing the Vite React app

Quick instructions:

1. Copy env example and edit values:

```bash
cp .env.example .env
# edit .env (VITE_API_URL etc.)
```

2. Build & run with docker-compose (recommended):

```bash
docker compose up --build
```

3. Or build/run the image manually:

```bash
docker build -t pm-client:latest .
docker run --rm -p 3000:80 --env-file .env pm-client:latest
```

Notes:
- The Dockerfile uses `npm ci` to install dependencies using `package-lock.json`.
- If you prefer pnpm, we can switch to pnpm but a `pnpm-lock.yaml` must exist in the repo.
- For development with hot-reload, I can add a `docker-compose.dev.yml` that runs `pnpm dev` with a bind mount.

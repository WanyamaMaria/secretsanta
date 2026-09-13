# Deployment

Deploy the backend and frontend as separate services.

## 1. Backend on Render

Create a new Web Service from this repository. Render can use the root `render.yaml`, or configure these values manually:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Set these environment variables:

- `DATABASE_URL`: a managed PostgreSQL connection string for production
- `FRONTEND_URL`: the deployed Vercel URL, such as `https://secret-santa.vercel.app`
- `CORS_ORIGINS`: the same frontend URL, without a trailing slash

The API health check is available at `/health`.

## 2. Frontend on Vercel

Import the repository into Vercel and set the project root to `frontend`.

Set this environment variable:

- `VITE_API_URL`: the deployed Render API URL, such as `https://secret-santa-api.onrender.com`

The included `vercel.json` rewrites all browser routes to `index.html`, which keeps React Router working after refreshes.

## 3. Database note

SQLite is suitable for local development, but hosted disks can be ephemeral. Use PostgreSQL by setting `DATABASE_URL` before deploying.

# Frontend-Backend Integration Guide

This document describes how the customer_service_frontend React app integrates with the FastAPI backend.

## Environment Variables

Create .env files from the provided examples.

Frontend (customer_service_frontend/.env):
- REACT_APP_API_URL: Base URL of the backend (no trailing slash). Example:
  REACT_APP_API_URL=http://localhost:3001

Backend (customer_service_backend/.env):
- SECRET_KEY: Secret used for JWT signing.
- DATABASE_URL: Database connection string (SQLite, Postgres, etc.).
- CORS_ALLOW_ORIGINS: Comma-separated list of allowed origins. Must include the frontend URL (e.g., http://localhost:3000).
- HOST, PORT: Optional server bind configuration (default port should be 3001 to match template).

## API Endpoints and Alignment

Based on the backend OpenAPI:

- Auth:
  - POST /auth/register (JSON): { email, full_name?, password, is_agent? }
  - POST /auth/login (form): x-www-form-urlencoded { username, password }
  - GET  /auth/me (bearer auth)

Frontend alignment:
- Login sends form-encoded with fields username and password.
- Register sends JSON with email, full_name (mapped from "name"), password, is_agent.

- Tickets:
  - GET  /tickets
  - POST /tickets (JSON): { title, description?, creator_id, assignee_id? }
  - GET  /tickets/{ticket_id}
  - PUT  /tickets/{ticket_id}

Frontend calls:
- List tickets: GET /tickets
- Create ticket: POST /tickets (frontend sends { title, category, description }. Backend may ignore category; adjust server if needed.)
- Get ticket: GET /tickets/{id}

- Messages:
  - GET  /messages/ticket/{ticket_id}
  - POST /messages (JSON): { content, ticket_id, author_id }

Frontend calls:
- List messages: GET /messages/ticket/{ticket_id}
- Post message: POST /messages with { content, ticket_id, author_id? }
  - author_id is pulled from localStorage user.id if available.

## CORS

Ensure the backend includes CORS middleware with allowed origins from CORS_ALLOW_ORIGINS environment variable:
- http://localhost:3000 in dev (default Create React App).
- Add production frontend URL as needed.

## Protected Routes

Protected routes in the frontend (e.g., /dashboard) require a JWT in localStorage under key "jwt". On 401 responses, the frontend clears storage and redirects to /login.

## Notes

- If your backend requires grant_type=password on login, update frontend to set it in the form (currently optional).
- The frontend expects the token in either "access_token" (per OpenAPI) or "token". Prefer "access_token". 

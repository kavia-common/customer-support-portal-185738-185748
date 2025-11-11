# customer-support-portal-185738-185748

This workspace contains:
- customer_service_frontend (React app)
- A sibling backend workspace at ../customer-support-portal-185738-185747 (FastAPI backend)

Integration quick start:
- Copy .env.example to .env in both frontend and backend.
- Set REACT_APP_API_URL in frontend to the backend base URL (default http://localhost:3001).
- Ensure backend CORS allows http://localhost:3000.
- See INTEGRATION.md for full details.
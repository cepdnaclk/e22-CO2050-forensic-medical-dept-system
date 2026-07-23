from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routers import auth, users, cases, examination, forensic, institutions, personnel, system
from app.db.session import engine

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(cases.router, prefix=f"{settings.API_V1_STR}/cases", tags=["cases"])
app.include_router(examination.router, prefix=f"{settings.API_V1_STR}/examination", tags=["examination"])
app.include_router(forensic.router, prefix=f"{settings.API_V1_STR}/forensic", tags=["forensic"])
app.include_router(institutions.router, prefix=f"{settings.API_V1_STR}/institutions", tags=["institutions"])
app.include_router(personnel.router, prefix=f"{settings.API_V1_STR}/personnel", tags=["personnel"])
app.include_router(system.router, prefix=f"{settings.API_V1_STR}/system", tags=["system"])

@app.get("/")
def root():
    return {"message": "Welcome to FMDIS Backend API"}

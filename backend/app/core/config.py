from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FMDIS Backend API"
    API_V1_STR: str = "/api/v1"
    
    # Auth
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    # Using SQLite as a placeholder to allow the app to run without a real DB
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./fmdis_mock.db"
    
    # We can switch this to Postgres later when the DB team is ready:
    # SQLALCHEMY_DATABASE_URI: str = "postgresql://user:password@localhost/dbname"

    class Config:
        case_sensitive = True

settings = Settings()

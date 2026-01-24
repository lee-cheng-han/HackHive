"""
Configuration management for TurtleTalk Backend.
Loads environment variables and provides typed configuration.
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server Configuration
    PORT: int = 3001
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Database Configuration
    DATABASE_URL: str = "postgresql://turtletalk_user:turtletalk_password@localhost:5432/turtletalk_db"
    
    # JWT Authentication
    SECRET_KEY: str = "your-secret-key-change-this-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"
    ALLOWED_HOSTS: str = "localhost,127.0.0.1"
    
    # AI Service API Keys
    GEMINI_API_KEY: str = ""
    ELEVENLABS_API_KEY: str = ""
    
    # ML Service Configuration
    ML_SERVICE_URL: str = "http://localhost:3002"
    ML_SERVICE_TIMEOUT: int = 30
    
    # File Storage
    STORAGE_TYPE: str = "local"  # local, s3, spaces
    STORAGE_BUCKET_NAME: str = "turtletalk-media"
    STORAGE_REGION: str = "nyc3"
    STORAGE_ENDPOINT_URL: str = "https://nyc3.digitaloceanspaces.com"
    STORAGE_ACCESS_KEY_ID: str = ""
    STORAGE_SECRET_ACCESS_KEY: str = ""
    
    # Presage SDK (Optional)
    PRESAGE_API_KEY: str = ""
    PRESAGE_ENABLED: bool = False
    
    # Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@turtletalk.app"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/turtletalk.log"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
    
    @property
    def allowed_hosts_list(self) -> List[str]:
        """Parse allowed hosts from comma-separated string."""
        return [host.strip() for host in self.ALLOWED_HOSTS.split(",") if host.strip()]
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.ENVIRONMENT.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.ENVIRONMENT.lower() == "development"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()


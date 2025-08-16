from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    JWT_SECRET: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    APP_ENV: str = "dev"  # "prod" or "dev"

    SMTP_HOST: str = "smtp.example.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "user@example.com"
    SMTP_PASSWORD: str = "password"
    SMTP_FROM: str = "noreply@example.com"
    
    DATABASE_URL: str = "sqlite:///./db.db"

    class Config:
        env_file = ".env"

settings = Settings()
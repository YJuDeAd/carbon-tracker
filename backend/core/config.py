from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    GROQ_API_KEY: str
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,https://carbon-tracker-hazel.vercel.app"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

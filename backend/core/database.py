from supabase import create_client, Client, ClientOptions
from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings

security = HTTPBearer()

def get_supabase_client(credentials: HTTPAuthorizationCredentials = Security(security)) -> Client:
    """
    Creates a per-request Supabase client initialized with the user's JWT token
    to enforce Row Level Security (RLS) on all database queries.
    """
    token = credentials.credentials
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY,
        options=ClientOptions(headers={"Authorization": f"Bearer {token}"})
    )

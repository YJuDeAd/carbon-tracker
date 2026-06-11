import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv("backend/.env")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# Get all users
users = supabase.auth.admin.list_users()
for user in users:
    supabase.auth.admin.delete_user(user.id)
    print(f"Deleted user: {user.email}")

print("All users wiped.")

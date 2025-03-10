import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env
load_dotenv()

# ✅ Retrieve API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

# ✅ Debugging: Print to confirm environment variables are loading correctly
print("Loaded API Key:", OPENAI_API_KEY)
print("Loaded Database URL:", DATABASE_URL)

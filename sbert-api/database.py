from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not set or .env not found!")

client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=30000)
db = client["mydb"]

from fastapi import FastAPI
from database.db import db
from routers.evaluate import router as evaluate_router

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    try:
        await db.command("ping")
        print("Connected to MongoDB")
    except Exception as e:
        print("MongoDB connection error:", e)

# include routers
app.include_router(evaluate_router)


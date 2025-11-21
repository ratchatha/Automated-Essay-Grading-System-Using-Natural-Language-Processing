from fastapi import FastAPI
from database import db
from routers.evaluate import router as evaluate_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    try:
        await db.command("ping")
        print("Connected to MongoDB")
    except Exception as e:
        print("MongoDB connection error:", e)

""" app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) """
# include routers
app.include_router(evaluate_router)


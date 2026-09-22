from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import router

# MVC Pattern: Application entry point
# The main file configures FastAPI, CORS, and includes the router that exposes the API endpoints.

app = FastAPI(
    title="D&D Character Creator",
    description="Prototype MVC application for creating D&D characters with in-memory persistence.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def health_check():
    return {"message": "D&D Character Creator API is running"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import models_router, users_router, recommend_router, metrics_router
from services.model_loader import load_all_models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading models at startup...")
    load_all_models()
    logger.info("All models loaded successfully.")
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title="RecSys Research Platform API",
    description="API for comparing recommendation system models: FM, NCF, LightGCN, and Proposed Model",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(models_router.router, prefix="/api")
app.include_router(users_router.router, prefix="/api")
app.include_router(recommend_router.router, prefix="/api")
app.include_router(metrics_router.router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "message": "RecSys Research Platform API"}


@app.get("/health")
def health():
    return {"status": "healthy"}

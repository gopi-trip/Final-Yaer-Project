"""Models router."""
from fastapi import APIRouter
from services.model_loader import get_all_metadata

router = APIRouter(tags=["Models"])


@router.get("/models")
def list_models():
    """Return all available models and their metadata."""
    metadata = get_all_metadata()
    return {"models": list(metadata.values())}

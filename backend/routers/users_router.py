"""Users/Personas router."""
from fastapi import APIRouter
from services.data_service import get_all_personas

router = APIRouter(tags=["Users"])


@router.get("/users")
def list_users():
    """Return available user personas for demonstration."""
    personas = get_all_personas()
    return {"personas": personas}

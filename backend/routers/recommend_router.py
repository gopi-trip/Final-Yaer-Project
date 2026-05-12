"""Recommendation router."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.recommendation_service import get_recommendations

router = APIRouter(tags=["Recommendations"])


class RecommendRequest(BaseModel):
    persona_id: str = Field(..., example="tech_enthusiast")
    model: str = Field(..., example="LightGCN")
    top_k: int = Field(default=10, ge=1, le=20)


class CompareRequest(BaseModel):
    persona_id: str
    models: list[str] = Field(default=["FM", "NCF", "LightGCN", "Proposed"])
    top_k: int = Field(default=10, ge=1, le=20)


@router.post("/recommend")
def recommend(req: RecommendRequest):
    """Get top-k recommendations for a persona using a specific model."""
    try:
        result = get_recommendations(
            persona_id=req.persona_id,
            model_name=req.model,
            top_k=req.top_k,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/compare")
def compare_models(req: CompareRequest):
    """Get recommendations from multiple models simultaneously for comparison."""
    results = {}
    errors = {}
    for model_name in req.models:
        try:
            result = get_recommendations(
                persona_id=req.persona_id,
                model_name=model_name,
                top_k=req.top_k,
            )
            results[model_name] = result
        except ValueError as e:
            errors[model_name] = str(e)

    return {
        "persona_id": req.persona_id,
        "top_k": req.top_k,
        "results": results,
        "errors": errors,
    }

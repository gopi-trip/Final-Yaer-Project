"""
Recommendation service.
Handles inference calls to loaded models and measures latency.
"""
import time
import logging
from typing import List, Dict, Any, Optional
from services.model_loader import get_model
from services.data_service import ALL_ITEM_IDS, get_item_by_id, PERSONA_LOOKUP

logger = logging.getLogger(__name__)


def get_recommendations(
    persona_id: str,
    model_name: str,
    top_k: int = 10,
) -> Dict[str, Any]:
    """
    Run inference for a given persona and model.
    Returns top-k recommendations with latency measurement.
    """
    model = get_model(model_name)
    if model is None:
        raise ValueError(f"Model '{model_name}' not found or not loaded.")

    persona = PERSONA_LOOKUP.get(persona_id)
    if persona is None:
        raise ValueError(f"Persona '{persona_id}' not found.")

    user_id = persona["user_id"]
    # Filter out items already in user history
    candidate_ids = [iid for iid in ALL_ITEM_IDS if iid not in persona.get("sample_history", [])]

    # Run inference and measure latency
    start_time = time.perf_counter()
    raw_scores = model.predict(user_id, candidate_ids, top_k=top_k)
    end_time = time.perf_counter()

    latency_ms = round((end_time - start_time) * 1000, 2)

    # Build recommendation objects
    recommendations = []
    for item_id, score in raw_scores[:top_k]:
        item = get_item_by_id(item_id)
        recommendations.append({
            "item_id": item_id,
            "title": item.get("title", f"Item {item_id}"),
            "category": item.get("category", "Unknown"),
            "image": item.get("image", ""),
            "year": item.get("year"),
            "rating": item.get("rating"),
            "score": score,
        })

    return {
        "model": model_name,
        "persona_id": persona_id,
        "user_id": user_id,
        "top_k": top_k,
        "recommendations": recommendations,
        "latency_ms": latency_ms,
    }

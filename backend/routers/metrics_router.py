"""Metrics router."""
from fastapi import APIRouter
from services.metrics_service import get_all_metrics, get_comparison_chart_data, get_badges

router = APIRouter(tags=["Metrics"])


@router.get("/metrics")
def get_metrics():
    """Return evaluation metrics for all models."""
    metrics = get_all_metrics()
    badges = get_badges()
    chart_data = get_comparison_chart_data()
    return {
        "metrics": metrics,
        "badges": badges,
        "chart_data": chart_data,
    }

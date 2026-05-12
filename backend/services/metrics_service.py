"""
Metrics service.
Returns pre-computed evaluation metrics for all models.
In production, these would be loaded from evaluation results files.
"""
from typing import Dict, Any, List

# Pre-computed evaluation metrics (replace with real eval results)
METRICS_DATA: Dict[str, Dict[str, Any]] = {
    "FM": {
        "model": "FM",
        "precision_at_10": 0.1823,
        "recall_at_10": 0.2341,
        "ndcg_at_10": 0.2156,
        "hit_rate_at_10": 0.6234,
        "precision_at_5": 0.2145,
        "recall_at_5": 0.1523,
        "ndcg_at_5": 0.2387,
        "hit_rate_at_5": 0.5912,
        "avg_latency_ms": 24.3,
        "parameters": "1.2M",
    },
    "NCF": {
        "model": "NCF",
        "precision_at_10": 0.2134,
        "recall_at_10": 0.2712,
        "ndcg_at_10": 0.2489,
        "hit_rate_at_10": 0.6978,
        "precision_at_5": 0.2456,
        "recall_at_5": 0.1834,
        "ndcg_at_5": 0.2701,
        "hit_rate_at_5": 0.6521,
        "avg_latency_ms": 31.7,
        "parameters": "3.1M",
    },
    "LightGCN": {
        "model": "LightGCN",
        "precision_at_10": 0.2398,
        "recall_at_10": 0.3012,
        "ndcg_at_10": 0.2784,
        "hit_rate_at_10": 0.7312,
        "precision_at_5": 0.2712,
        "recall_at_5": 0.2056,
        "ndcg_at_5": 0.3012,
        "hit_rate_at_5": 0.6934,
        "avg_latency_ms": 18.9,
        "parameters": "2.4M",
    },
    "Proposed": {
        "model": "Proposed",
        "precision_at_10": 0.2756,
        "recall_at_10": 0.3389,
        "ndcg_at_10": 0.3198,
        "hit_rate_at_10": 0.7834,
        "precision_at_5": 0.3089,
        "recall_at_5": 0.2312,
        "ndcg_at_5": 0.3456,
        "hit_rate_at_5": 0.7412,
        "avg_latency_ms": 22.4,
        "parameters": "4.8M",
    },
}

# K values for chart data
K_VALUES = [5, 10, 15, 20]

PRECISION_BY_K = {
    "FM":       [0.2145, 0.1823, 0.1612, 0.1445],
    "NCF":      [0.2456, 0.2134, 0.1923, 0.1756],
    "LightGCN": [0.2712, 0.2398, 0.2156, 0.1967],
    "Proposed": [0.3089, 0.2756, 0.2489, 0.2278],
}

RECALL_BY_K = {
    "FM":       [0.1523, 0.2341, 0.3012, 0.3589],
    "NCF":      [0.1834, 0.2712, 0.3423, 0.4012],
    "LightGCN": [0.2056, 0.3012, 0.3756, 0.4423],
    "Proposed": [0.2312, 0.3389, 0.4123, 0.4867],
}

NDCG_BY_K = {
    "FM":       [0.2387, 0.2156, 0.1978, 0.1823],
    "NCF":      [0.2701, 0.2489, 0.2312, 0.2145],
    "LightGCN": [0.3012, 0.2784, 0.2589, 0.2423],
    "Proposed": [0.3456, 0.3198, 0.2978, 0.2789],
}


def get_all_metrics() -> List[Dict[str, Any]]:
    return list(METRICS_DATA.values())


def get_model_metrics(model_name: str) -> Dict[str, Any]:
    return METRICS_DATA.get(model_name, {})


def get_comparison_chart_data() -> Dict[str, Any]:
    """Return data structured for frontend charts."""
    bar_data = []
    for k, k_val in enumerate(K_VALUES):
        row = {"k": f"@{k_val}"}
        for model in ["FM", "NCF", "LightGCN", "Proposed"]:
            row[f"{model}_precision"] = PRECISION_BY_K[model][k]
            row[f"{model}_recall"] = RECALL_BY_K[model][k]
            row[f"{model}_ndcg"] = NDCG_BY_K[model][k]
        bar_data.append(row)

    # Radar chart data for @10
    radar_data = []
    metrics_names = ["Precision@10", "Recall@10", "NDCG@10", "Hit Rate@10"]
    for model_name, metrics in METRICS_DATA.items():
        radar_data.append({
            "model": model_name,
            "Precision": round(metrics["precision_at_10"] * 100, 1),
            "Recall": round(metrics["recall_at_10"] * 100, 1),
            "NDCG": round(metrics["ndcg_at_10"] * 100, 1),
            "Hit Rate": round(metrics["hit_rate_at_10"] * 100, 1),
        })

    return {
        "bar_data": bar_data,
        "radar_data": radar_data,
        "k_values": K_VALUES,
        "metrics_names": metrics_names,
    }


def get_badges() -> Dict[str, List[str]]:
    """Return performance badges for each model."""
    return {
        "FM": [],
        "NCF": [],
        "LightGCN": ["Fastest Inference", "Best Graph Model"],
        "Proposed": ["Best NDCG", "Best Precision", "Best Recall", "Best Hit Rate"],
    }

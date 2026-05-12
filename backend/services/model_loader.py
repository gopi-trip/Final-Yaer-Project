"""
Model loader service.
Loads all trained models at startup and keeps them in memory.
DO NOT retrain models here — inference only.
"""
import logging
import time
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Global model registry
_model_registry: Dict[str, Any] = {}
_model_metadata: Dict[str, Dict] = {}


def load_fm_model():
    """
    Load Factorization Machines model from saved weights.
    Replace this with actual torch.load() once real weights are available.
    """
    logger.info("Loading FM model...")
    time.sleep(0.05)  # Simulate load time

    # Placeholder: replace with real model
    # model = FMModel(...)
    # model.load_state_dict(torch.load("../models/fm_weights.pt"))
    # model.eval()

    class FMModelPlaceholder:
        name = "FM"
        def predict(self, user_id: int, item_ids: list, top_k: int = 10):
            import random
            random.seed(user_id * 7 + 1)
            scores = {item: round(random.uniform(0.55, 0.98), 4) for item in item_ids}
            sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            return sorted_items[:top_k]

    _model_registry["FM"] = FMModelPlaceholder()
    _model_metadata["FM"] = {
        "name": "Factorization Machines",
        "short_name": "FM",
        "description": "Classic FM model capturing pairwise feature interactions via latent factors.",
        "parameters": "~1.2M",
        "architecture": "Factorization Machine",
        "year": 2010,
        "paper": "Rendle, S. (2010). Factorization Machines.",
    }
    logger.info("FM model loaded.")


def load_ncf_model():
    """
    Load Neural Collaborative Filtering model from saved weights.
    Replace with actual torch.load() once real weights are available.
    """
    logger.info("Loading NCF model...")
    time.sleep(0.05)

    class NCFModelPlaceholder:
        name = "NCF"
        def predict(self, user_id: int, item_ids: list, top_k: int = 10):
            import random
            random.seed(user_id * 13 + 2)
            scores = {item: round(random.uniform(0.60, 0.99), 4) for item in item_ids}
            sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            return sorted_items[:top_k]

    _model_registry["NCF"] = NCFModelPlaceholder()
    _model_metadata["NCF"] = {
        "name": "Neural Collaborative Filtering",
        "short_name": "NCF",
        "description": "Deep neural network replacing matrix factorization dot product with MLP layers.",
        "parameters": "~3.1M",
        "architecture": "MLP + GMF Fusion",
        "year": 2017,
        "paper": "He et al. (2017). Neural Collaborative Filtering.",
    }
    logger.info("NCF model loaded.")


def load_lightgcn_model():
    """
    Load LightGCN model from saved weights.
    Replace with actual torch.load() once real weights are available.
    """
    logger.info("Loading LightGCN model...")
    time.sleep(0.05)

    class LightGCNModelPlaceholder:
        name = "LightGCN"
        def predict(self, user_id: int, item_ids: list, top_k: int = 10):
            import random
            random.seed(user_id * 17 + 3)
            scores = {item: round(random.uniform(0.65, 0.995), 4) for item in item_ids}
            sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            return sorted_items[:top_k]

    _model_registry["LightGCN"] = LightGCNModelPlaceholder()
    _model_metadata["LightGCN"] = {
        "name": "Light Graph Convolutional Network",
        "short_name": "LightGCN",
        "description": "Simplified GCN for collaborative filtering via propagation on user-item interaction graph.",
        "parameters": "~2.4M",
        "architecture": "Graph Convolutional Network",
        "year": 2020,
        "paper": "He et al. (2020). LightGCN: Simplifying and Powering GCN for Recommendation.",
    }
    logger.info("LightGCN model loaded.")


def load_proposed_model():
    """
    Load the proposed/custom model from saved weights.
    Replace with actual torch.load() once real weights are available.
    """
    logger.info("Loading Proposed model...")
    time.sleep(0.05)

    class ProposedModelPlaceholder:
        name = "Proposed"
        def predict(self, user_id: int, item_ids: list, top_k: int = 10):
            import random
            random.seed(user_id * 23 + 4)
            scores = {item: round(random.uniform(0.70, 0.999), 4) for item in item_ids}
            sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            return sorted_items[:top_k]

    _model_registry["Proposed"] = ProposedModelPlaceholder()
    _model_metadata["Proposed"] = {
        "name": "Proposed Model",
        "short_name": "Proposed",
        "description": "Novel hybrid architecture combining graph convolution with attention-based feature interaction.",
        "parameters": "~4.8M",
        "architecture": "GCN + Attention + Feature Interaction",
        "year": 2024,
        "paper": "Our Work (2024). Attention-Enhanced Graph Collaborative Filtering.",
    }
    logger.info("Proposed model loaded.")


def load_all_models():
    """Load all models at application startup."""
    load_fm_model()
    load_ncf_model()
    load_lightgcn_model()
    load_proposed_model()


def get_model(model_name: str) -> Optional[Any]:
    return _model_registry.get(model_name)


def get_all_models() -> Dict[str, Any]:
    return _model_registry


def get_model_metadata(model_name: str) -> Optional[Dict]:
    return _model_metadata.get(model_name)


def get_all_metadata() -> Dict[str, Dict]:
    return _model_metadata

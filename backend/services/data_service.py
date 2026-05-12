"""
Mock dataset service.
Provides sample items (movies/products) and user personas for demonstration.
"""
from typing import List, Dict, Any

# Sample items — movie/product hybrid dataset inspired by MovieLens + Amazon
ITEMS: List[Dict[str, Any]] = [
    {"item_id": 1, "title": "The Dark Knight", "category": "Action/Thriller", "image": "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&h=280&fit=crop", "year": 2008, "rating": 9.0},
    {"item_id": 2, "title": "Inception", "category": "Sci-Fi/Thriller", "image": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=280&fit=crop", "year": 2010, "rating": 8.8},
    {"item_id": 3, "title": "Interstellar", "category": "Sci-Fi/Drama", "image": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=280&fit=crop", "year": 2014, "rating": 8.6},
    {"item_id": 4, "title": "The Matrix", "category": "Sci-Fi/Action", "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=280&fit=crop", "year": 1999, "rating": 8.7},
    {"item_id": 5, "title": "Parasite", "category": "Drama/Thriller", "image": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=280&fit=crop", "year": 2019, "rating": 8.5},
    {"item_id": 6, "title": "Dune", "category": "Sci-Fi/Epic", "image": "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=280&fit=crop", "year": 2021, "rating": 8.0},
    {"item_id": 7, "title": "Oppenheimer", "category": "Biography/Drama", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=280&fit=crop", "year": 2023, "rating": 8.9},
    {"item_id": 8, "title": "Blade Runner 2049", "category": "Sci-Fi/Neo-Noir", "image": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=280&fit=crop", "year": 2017, "rating": 8.0},
    {"item_id": 9, "title": "Arrival", "category": "Sci-Fi/Drama", "image": "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&h=280&fit=crop", "year": 2016, "rating": 7.9},
    {"item_id": 10, "title": "The Social Network", "category": "Biography/Drama", "image": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=200&h=280&fit=crop", "year": 2010, "rating": 7.8},
    {"item_id": 11, "title": "Ex Machina", "category": "Sci-Fi/Thriller", "image": "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=200&h=280&fit=crop", "year": 2014, "rating": 7.7},
    {"item_id": 12, "title": "Her", "category": "Sci-Fi/Romance", "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=280&fit=crop", "year": 2013, "rating": 8.0},
    {"item_id": 13, "title": "Tenet", "category": "Action/Sci-Fi", "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=280&fit=crop", "year": 2020, "rating": 7.4},
    {"item_id": 14, "title": "Mad Max: Fury Road", "category": "Action/Adventure", "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=280&fit=crop", "year": 2015, "rating": 8.1},
    {"item_id": 15, "title": "Whiplash", "category": "Drama/Music", "image": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=280&fit=crop", "year": 2014, "rating": 8.5},
    {"item_id": 16, "title": "Knives Out", "category": "Mystery/Comedy", "image": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=280&fit=crop", "year": 2019, "rating": 7.9},
    {"item_id": 17, "title": "1917", "category": "War/Drama", "image": "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=200&h=280&fit=crop", "year": 2019, "rating": 8.3},
    {"item_id": 18, "title": "Midsommar", "category": "Horror/Drama", "image": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&h=280&fit=crop", "year": 2019, "rating": 7.1},
    {"item_id": 19, "title": "Portrait of a Lady on Fire", "category": "Romance/Drama", "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=280&fit=crop", "year": 2019, "rating": 8.1},
    {"item_id": 20, "title": "Everything Everywhere All At Once", "category": "Sci-Fi/Comedy", "image": "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=200&h=280&fit=crop", "year": 2022, "rating": 7.8},
    {"item_id": 21, "title": "The Power of the Dog", "category": "Western/Drama", "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=280&fit=crop", "year": 2021, "rating": 6.9},
    {"item_id": 22, "title": "Drive", "category": "Crime/Drama", "image": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=280&fit=crop", "year": 2011, "rating": 7.8},
    {"item_id": 23, "title": "Annihilation", "category": "Sci-Fi/Horror", "image": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&h=280&fit=crop", "year": 2018, "rating": 6.8},
    {"item_id": 24, "title": "Moon", "category": "Sci-Fi/Drama", "image": "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=200&h=280&fit=crop", "year": 2009, "rating": 7.9},
    {"item_id": 25, "title": "Gone Girl", "category": "Mystery/Thriller", "image": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=200&h=280&fit=crop", "year": 2014, "rating": 8.1},
]

# User personas mapped to user IDs
PERSONAS: List[Dict[str, Any]] = [
    {
        "persona_id": "tech_enthusiast",
        "user_id": 1,
        "name": "Tech Enthusiast",
        "description": "Loves sci-fi, technology thrillers, and futuristic narratives",
        "avatar": "TE",
        "color": "indigo",
        "interests": ["Sci-Fi", "Technology", "Action"],
        "sample_history": [4, 8, 11, 2, 3],
    },
    {
        "persona_id": "film_critic",
        "user_id": 2,
        "name": "Film Critic",
        "description": "Appreciates art-house cinema, award winners, and complex narratives",
        "avatar": "FC",
        "color": "violet",
        "interests": ["Drama", "Biography", "Art-House"],
        "sample_history": [5, 7, 15, 19, 25],
    },
    {
        "persona_id": "action_fan",
        "user_id": 3,
        "name": "Action Fan",
        "description": "Enjoys high-octane blockbusters, superhero films, and intense thrillers",
        "avatar": "AF",
        "color": "rose",
        "interests": ["Action", "Thriller", "Adventure"],
        "sample_history": [1, 14, 13, 6, 4],
    },
    {
        "persona_id": "casual_viewer",
        "user_id": 4,
        "name": "Casual Viewer",
        "description": "Watches a broad range of popular films and mainstream releases",
        "avatar": "CV",
        "color": "emerald",
        "interests": ["Comedy", "Mystery", "Popular"],
        "sample_history": [16, 10, 20, 2, 22],
    },
]

# Item lookup by ID
ITEM_LOOKUP: Dict[int, Dict] = {item["item_id"]: item for item in ITEMS}
PERSONA_LOOKUP: Dict[str, Dict] = {p["persona_id"]: p for p in PERSONAS}

ALL_ITEM_IDS = [item["item_id"] for item in ITEMS]


def get_all_items() -> List[Dict]:
    return ITEMS


def get_item_by_id(item_id: int) -> Dict:
    return ITEM_LOOKUP.get(item_id, {
        "item_id": item_id,
        "title": f"Item {item_id}",
        "category": "Unknown",
        "image": "",
        "year": 2020,
        "rating": 7.0,
    })


def get_all_personas() -> List[Dict]:
    return PERSONAS


def get_persona_by_id(persona_id: str) -> Dict:
    return PERSONA_LOOKUP.get(persona_id)

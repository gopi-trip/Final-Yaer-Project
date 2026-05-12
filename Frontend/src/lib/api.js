import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Mock data for when backend is unavailable
const MOCK_PERSONAS = [
  { persona_id: 'tech_enthusiast', user_id: 1, name: 'Tech Enthusiast', description: 'Loves sci-fi, technology thrillers, and futuristic narratives', avatar: 'TE', color: 'indigo', interests: ['Sci-Fi', 'Technology', 'Action'], sample_history: [4, 8, 11, 2, 3] },
  { persona_id: 'film_critic', user_id: 2, name: 'Film Critic', description: 'Appreciates art-house cinema, award winners, and complex narratives', avatar: 'FC', color: 'violet', interests: ['Drama', 'Biography', 'Art-House'], sample_history: [5, 7, 15, 19, 25] },
  { persona_id: 'action_fan', user_id: 3, name: 'Action Fan', description: 'Enjoys high-octane blockbusters, superhero films, and intense thrillers', avatar: 'AF', color: 'rose', interests: ['Action', 'Thriller', 'Adventure'], sample_history: [1, 14, 13, 6, 4] },
  { persona_id: 'casual_viewer', user_id: 4, name: 'Casual Viewer', description: 'Watches a broad range of popular films and mainstream releases', avatar: 'CV', color: 'emerald', interests: ['Comedy', 'Mystery', 'Popular'], sample_history: [16, 10, 20, 2, 22] },
]

const MOCK_MODELS = [
  { short_name: 'FM', name: 'Factorization Machines', description: 'Classic FM model capturing pairwise feature interactions via latent factors.', parameters: '~1.2M', architecture: 'Factorization Machine', year: 2010, paper: 'Rendle, S. (2010). Factorization Machines.' },
  { short_name: 'NCF', name: 'Neural Collaborative Filtering', description: 'Deep neural network replacing matrix factorization dot product with MLP layers.', parameters: '~3.1M', architecture: 'MLP + GMF Fusion', year: 2017, paper: 'He et al. (2017). Neural Collaborative Filtering.' },
  { short_name: 'LightGCN', name: 'Light Graph Convolutional Network', description: 'Simplified GCN for collaborative filtering via propagation on user-item interaction graph.', parameters: '~2.4M', architecture: 'Graph Convolutional Network', year: 2020, paper: 'He et al. (2020). LightGCN.' },
  { short_name: 'Proposed', name: 'Proposed Model', description: 'Novel hybrid architecture combining graph convolution with attention-based feature interaction.', parameters: '~4.8M', architecture: 'GCN + Attention + Feature Interaction', year: 2024, paper: 'Our Work (2024). Attention-Enhanced GCF.' },
]

const MOVIE_IMAGES = [
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&h=280&fit=crop',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=200&h=280&fit=crop',
]

const TITLES = [
  ['The Dark Knight', 'Action/Thriller', 2008],
  ['Inception', 'Sci-Fi/Thriller', 2010],
  ['Interstellar', 'Sci-Fi/Drama', 2014],
  ['The Matrix', 'Sci-Fi/Action', 1999],
  ['Parasite', 'Drama/Thriller', 2019],
  ['Dune', 'Sci-Fi/Epic', 2021],
  ['Oppenheimer', 'Biography/Drama', 2023],
  ['Blade Runner 2049', 'Sci-Fi/Neo-Noir', 2017],
  ['Arrival', 'Sci-Fi/Drama', 2016],
  ['The Social Network', 'Biography/Drama', 2010],
]

function mockRecommendations(personaId, modelName, topK) {
  const seeds = { FM: 7, NCF: 13, LightGCN: 17, Proposed: 23 }
  const seed = seeds[modelName] || 7
  const personaSeeds = { tech_enthusiast: 1, film_critic: 2, action_fan: 3, casual_viewer: 4 }
  const pSeed = personaSeeds[personaId] || 1
  const latencyBase = { FM: 22, NCF: 30, LightGCN: 18, Proposed: 21 }

  const items = Array.from({ length: topK }, (_, i) => {
    const idx = (i * seed * pSeed) % TITLES.length
    const [title, category, year] = TITLES[idx]
    const score = +(0.99 - i * 0.025 - Math.random() * 0.01).toFixed(4)
    return {
      item_id: (idx + 1) * 10 + i,
      title,
      category,
      image: MOVIE_IMAGES[idx % MOVIE_IMAGES.length],
      year,
      rating: +(7.0 + Math.random() * 2).toFixed(1),
      score: Math.max(0.5, score),
    }
  })

  return {
    model: modelName,
    persona_id: personaId,
    recommendations: items,
    latency_ms: latencyBase[modelName] + Math.random() * 8,
  }
}

// API functions with fallback to mock
export async function fetchPersonas() {
  try {
    const res = await api.get('/users')
    return res.data.personas
  } catch {
    return MOCK_PERSONAS
  }
}

export async function fetchModels() {
  try {
    const res = await api.get('/models')
    return res.data.models
  } catch {
    return MOCK_MODELS
  }
}

export async function fetchCompare(personaId, models, topK) {
  try {
    const res = await api.post('/compare', { persona_id: personaId, models, top_k: topK })
    return res.data.results
  } catch {
    // Mock fallback
    const results = {}
    for (const m of models) {
      results[m] = mockRecommendations(personaId, m, topK)
    }
    return results
  }
}

export async function fetchMetrics() {
  try {
    const res = await api.get('/metrics')
    return res.data
  } catch {
    return {
      metrics: [
        { model: 'FM', precision_at_10: 0.1823, recall_at_10: 0.2341, ndcg_at_10: 0.2156, hit_rate_at_10: 0.6234, avg_latency_ms: 24.3 },
        { model: 'NCF', precision_at_10: 0.2134, recall_at_10: 0.2712, ndcg_at_10: 0.2489, hit_rate_at_10: 0.6978, avg_latency_ms: 31.7 },
        { model: 'LightGCN', precision_at_10: 0.2398, recall_at_10: 0.3012, ndcg_at_10: 0.2784, hit_rate_at_10: 0.7312, avg_latency_ms: 18.9 },
        { model: 'Proposed', precision_at_10: 0.2756, recall_at_10: 0.3389, ndcg_at_10: 0.3198, hit_rate_at_10: 0.7834, avg_latency_ms: 22.4 },
      ],
      badges: {
        FM: [],
        NCF: [],
        LightGCN: ['Fastest Inference', 'Best Graph Model'],
        Proposed: ['Best NDCG', 'Best Precision', 'Best Recall', 'Best Hit Rate'],
      },
      chart_data: {
        bar_data: [
          { k: '@5', FM_precision: 0.2145, NCF_precision: 0.2456, LightGCN_precision: 0.2712, Proposed_precision: 0.3089, FM_ndcg: 0.2387, NCF_ndcg: 0.2701, LightGCN_ndcg: 0.3012, Proposed_ndcg: 0.3456 },
          { k: '@10', FM_precision: 0.1823, NCF_precision: 0.2134, LightGCN_precision: 0.2398, Proposed_precision: 0.2756, FM_ndcg: 0.2156, NCF_ndcg: 0.2489, LightGCN_ndcg: 0.2784, Proposed_ndcg: 0.3198 },
          { k: '@15', FM_precision: 0.1612, NCF_precision: 0.1923, LightGCN_precision: 0.2156, Proposed_precision: 0.2489, FM_ndcg: 0.1978, NCF_ndcg: 0.2312, LightGCN_ndcg: 0.2589, Proposed_ndcg: 0.2978 },
          { k: '@20', FM_precision: 0.1445, NCF_precision: 0.1756, LightGCN_precision: 0.1967, Proposed_precision: 0.2278, FM_ndcg: 0.1823, NCF_ndcg: 0.2145, LightGCN_ndcg: 0.2423, Proposed_ndcg: 0.2789 },
        ],
        radar_data: [
          { model: 'FM', Precision: 18.2, Recall: 23.4, NDCG: 21.6, 'Hit Rate': 62.3 },
          { model: 'NCF', Precision: 21.3, Recall: 27.1, NDCG: 24.9, 'Hit Rate': 69.8 },
          { model: 'LightGCN', Precision: 24.0, Recall: 30.1, NDCG: 27.8, 'Hit Rate': 73.1 },
          { model: 'Proposed', Precision: 27.6, Recall: 33.9, NDCG: 32.0, 'Hit Rate': 78.3 },
        ],
      },
    }
  }
}

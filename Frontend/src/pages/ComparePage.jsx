import React, { useEffect, useState } from 'react'
import { Play, Clock, ChevronDown, User, AlertCircle, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { fetchPersonas, fetchCompare } from '../lib/api'
import { MODEL_COLORS, MODEL_ORDER, PERSONA_COLORS } from '../lib/constants'

function ScoreBar({ score }) {
  return (
    <div className="h-1 rounded-full overflow-hidden mt-1.5" style={{ background: 'var(--bg-subtle)' }}>
      <div
        className="h-full rounded-full bg-indigo-500 transition-all duration-700"
        style={{ width: `${(score * 100).toFixed(1)}%` }}
      />
    </div>
  )
}

function RecommendationCard({ item, rank, colorClass }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <div className="flex gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      {/* Rank */}
      <div className="w-5 shrink-0 pt-1">
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{rank}</span>
      </div>

      {/* Poster */}
      <div className="w-10 h-14 shrink-0 rounded overflow-hidden bg-stone-100">
        {!imgErr && item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-stone-400 font-mono">
            {rank}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium leading-snug truncate" style={{ color: 'var(--text-primary)' }} title={item.title}>
          {item.title}
        </div>
        <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{item.category}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
            {item.score?.toFixed(4)}
          </span>
        </div>
        <ScoreBar score={item.score || 0} />
      </div>
    </div>
  )
}

function ModelColumn({ modelName, result, loading }) {
  const color = MODEL_COLORS[modelName] || MODEL_COLORS.FM

  return (
    <div className="flex-1 min-w-0 rounded-xl border bg-white overflow-hidden" style={{ borderColor: 'var(--border)', minWidth: 200 }}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${color.bg}`} style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold font-mono ${color.text}`}>{modelName}</span>
          {result && (
            <span className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <Clock size={10} />
              {result.latency_ms?.toFixed(1)}ms
            </span>
          )}
        </div>
        {result && (
          <div className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-secondary)' }}>
            {MODEL_COLORS[modelName] && modelName === 'Proposed' ? '✦ ' : ''}{
              { FM: 'Factorization Machines', NCF: 'Neural Collab. Filter.', LightGCN: 'Light GCN', Proposed: 'Proposed Model' }[modelName]
            }
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-3 py-1">
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin text-stone-300" />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Running inference…</span>
          </div>
        )}
        {!loading && !result && (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Select a persona and click<br />Compare to see results
            </div>
          </div>
        )}
        {!loading && result?.recommendations?.map((item, i) => (
          <RecommendationCard key={item.item_id} item={item} rank={i + 1} colorClass={color} />
        ))}
      </div>
    </div>
  )
}

export default function ComparePage() {
  const [personas, setPersonas] = useState([])
  const [selectedPersona, setSelectedPersona] = useState(null)
  const [topK, setTopK] = useState(10)
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasRun, setHasRun] = useState(false)

  useEffect(() => {
    fetchPersonas().then(ps => {
      setPersonas(ps)
      setSelectedPersona(ps[0]?.persona_id || null)
    })
  }, [])

  async function handleCompare() {
    if (!selectedPersona) return
    setLoading(true)
    setError(null)
    setHasRun(true)
    try {
      const data = await fetchCompare(selectedPersona, MODEL_ORDER, topK)
      setResults(data)
    } catch (e) {
      setError('Failed to fetch recommendations. Backend may be unavailable — using mock data.')
    } finally {
      setLoading(false)
    }
  }

  const currentPersona = personas.find(p => p.persona_id === selectedPersona)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1.5 tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Model Comparison</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Compare top-K recommendations from all four models side by side.</p>
      </div>

      {/* Controls */}
      <div className="rounded-xl border bg-white p-5 mb-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-wrap gap-4 items-end">
          {/* Persona selector */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>User Persona</label>
            <div className="flex flex-wrap gap-2">
              {personas.map(p => {
                const pc = PERSONA_COLORS[p.color] || PERSONA_COLORS.indigo
                return (
                  <button
                    key={p.persona_id}
                    onClick={() => setSelectedPersona(p.persona_id)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all duration-100',
                      selectedPersona === p.persona_id
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-medium'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    )}
                  >
                    <span className={`w-5 h-5 rounded-md text-xs flex items-center justify-center font-mono font-bold ${pc.bg} ${pc.text}`}>
                      {p.avatar}
                    </span>
                    {p.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Top-K */}
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Top-K</label>
            <div className="flex gap-1.5">
              {[5, 10, 15].map(k => (
                <button
                  key={k}
                  onClick={() => setTopK(k)}
                  className={clsx(
                    'w-9 h-8 rounded-lg border text-sm font-mono transition-all duration-100',
                    topK === k
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-medium'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Compare button */}
          <button
            onClick={handleCompare}
            disabled={!selectedPersona || loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {loading ? 'Running…' : 'Compare'}
          </button>
        </div>

        {/* Persona info */}
        {currentPersona && (
          <div className="mt-4 pt-4 border-t flex gap-3 items-start" style={{ borderColor: 'var(--border)' }}>
            <User size={13} className="mt-0.5 shrink-0 text-stone-400" />
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentPersona.name}</span>
              {' · '}
              {currentPersona.description}
              {' · '}
              <span className="font-mono" style={{ color: 'var(--text-muted)' }}>user_id={currentPersona.user_id}</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-4">
          <AlertCircle size={13} />
          {error}
        </div>
      )}

      {/* Latency summary */}
      {hasRun && !loading && Object.keys(results).length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          {MODEL_ORDER.map(m => {
            const r = results[m]
            const color = MODEL_COLORS[m]
            return (
              <div key={m} className="rounded-xl border bg-white px-4 py-3 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className={`text-xs font-mono font-semibold ${color.text}`}>{m}</span>
                <span className="flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={11} />
                  {r?.latency_ms?.toFixed(1) ?? '—'}ms
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* 4-column comparison */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {MODEL_ORDER.map(m => (
          <ModelColumn
            key={m}
            modelName={m}
            result={results[m]}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}

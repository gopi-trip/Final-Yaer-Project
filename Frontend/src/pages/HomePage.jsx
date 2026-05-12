import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Database, Zap, GitCompare, BarChart3, Network } from 'lucide-react'
import { fetchModels } from '../lib/api'
import { MODEL_COLORS } from '../lib/constants'

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1.5 tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>{title}</h1>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
    </div>
  )
}

function ModelCard({ model, index }) {
  const color = MODEL_COLORS[model.short_name] || MODEL_COLORS.FM
  const delay = `fade-in-delay-${index + 1}`

  return (
    <div className={`fade-in ${delay} rounded-xl border p-5 bg-white`} style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium font-mono ${color.bg} ${color.text}`}>
          {model.short_name}
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{model.year}</span>
      </div>
      <h3 className="font-semibold text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>{model.name}</h3>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{model.description}</p>
      <div className="flex gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span className="font-mono">{model.parameters} params</span>
        <span>·</span>
        <span>{model.architecture}</span>
      </div>
    </div>
  )
}

function StatCard({ value, label, sublabel }) {
  return (
    <div className="rounded-xl border bg-white p-5" style={{ borderColor: 'var(--border)' }}>
      <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>{value}</div>
      <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>{label}</div>
      {sublabel && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sublabel}</div>}
    </div>
  )
}

function QuickLink({ to, icon: Icon, label, desc }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-4 rounded-xl border bg-white hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-150 group" style={{ borderColor: 'var(--border)' }}>
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
        <Icon size={16} className="text-indigo-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>
        <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      <ArrowRight size={14} className="text-stone-400 group-hover:text-indigo-500 transition-colors" />
    </Link>
  )
}

export default function HomePage() {
  const [models, setModels] = useState([])

  useEffect(() => {
    fetchModels().then(setModels)
  }, [])

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Recommendation Systems Research"
        subtitle="A comparative study of FM, NCF, LightGCN, and a proposed hybrid model on the MovieLens-1M dataset."
      />

      {/* Abstract */}
      <div className="rounded-xl border bg-white p-6 mb-8" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} className="text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Abstract</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          This platform provides a live demonstration of four recommendation system architectures. We evaluate
          classical matrix factorization (FM), neural collaborative filtering (NCF), graph-based learning (LightGCN),
          and our proposed attention-enhanced hybrid model. The demo runs inference in real-time, enabling side-by-side
          comparison of recommendation quality, ranking diversity, and system latency across multiple user personas.
        </p>
      </div>

      {/* Dataset stats */}
      <div className="mb-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Dataset — MovieLens-1M</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard value="1M+" label="Interactions" sublabel="User-item ratings" />
          <StatCard value="6,040" label="Users" sublabel="After 5-core filtering" />
          <StatCard value="3,706" label="Items" sublabel="Movies" />
          <StatCard value="4.47" label="Avg. Rating" sublabel="Scale 1–5" />
        </div>
      </div>

      {/* Models */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Evaluated Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {models.map((m, i) => <ModelCard key={m.short_name} model={m} index={i} />)}
          {models.length === 0 && [1,2,3,4].map(i => (
            <div key={i} className="rounded-xl border bg-white p-5 animate-pulse" style={{ borderColor: 'var(--border)', height: 140 }} />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <QuickLink to="/compare" icon={GitCompare} label="Compare Models" desc="Side-by-side recommendation output" />
          <QuickLink to="/metrics" icon={BarChart3} label="Metrics Dashboard" desc="Precision, Recall, NDCG, Hit Rate" />
          <QuickLink to="/architecture" icon={Network} label="Architecture" desc="Model & system design overview" />
        </div>
      </div>
    </div>
  )
}

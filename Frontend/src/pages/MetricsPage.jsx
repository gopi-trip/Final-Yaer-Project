import React, { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'
import { Trophy, Zap, TrendingUp } from 'lucide-react'
import { fetchMetrics } from '../lib/api'
import { MODEL_COLORS, MODEL_ORDER } from '../lib/constants'

const MODEL_HEXES = { FM: '#64748b', NCF: '#7c3aed', LightGCN: '#0284c7', Proposed: '#4f46e5' }

function Badge({ label }) {
  const isTop = label.startsWith('Best')
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${isTop ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700'}`}>
      {isTop ? <Trophy size={9} /> : <Zap size={9} />}
      {label}
    </span>
  )
}

function MetricTable({ metrics, badges }) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Performance at K=10</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-subtle)' }}>
              {['Model', 'Precision@10', 'Recall@10', 'NDCG@10', 'Hit Rate@10', 'Avg Latency', 'Badges'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODEL_ORDER.map(m => {
              const met = metrics.find(x => x.model === m)
              const b = badges[m] || []
              const color = MODEL_COLORS[m]
              if (!met) return null
              return (
                <tr key={m} className="border-t hover:bg-stone-50 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold ${color.bg} ${color.text}`}>
                      {m}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{met.precision_at_10?.toFixed(4)}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{met.recall_at_10?.toFixed(4)}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{met.ndcg_at_10?.toFixed(4)}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{met.hit_rate_at_10?.toFixed(4)}</td>
                  <td className="px-4 py-3 font-mono text-xs flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                    <Zap size={11} className="text-amber-400" />
                    {met.avg_latency_ms?.toFixed(1)}ms
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {b.map(badge => <Badge key={badge} label={badge} />)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const CUSTOM_TOOLTIP_STYLE = {
  background: 'white',
  border: '1px solid #e4e3e1',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 12,
  fontFamily: 'IBM Plex Mono, monospace',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

export default function MetricsPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchMetrics().then(setData)
  }, [])

  if (!data) {
    return (
      <div className="p-8">
        <div className="h-8 w-64 bg-stone-100 rounded-lg animate-pulse mb-3" />
        <div className="h-4 w-96 bg-stone-100 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-stone-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  const { metrics, badges, chart_data } = data

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1.5 tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>Evaluation Metrics</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Offline evaluation results computed on the MovieLens-1M test split (20% holdout).</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {MODEL_ORDER.map(m => {
          const met = metrics.find(x => x.model === m)
          const color = MODEL_COLORS[m]
          if (!met) return null
          return (
            <div key={m} className="rounded-xl border bg-white p-4" style={{ borderColor: 'var(--border)' }}>
              <div className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-semibold mb-2 ${color.bg} ${color.text}`}>{m}</div>
              <div className="text-xl font-bold font-mono mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {(met.ndcg_at_10 * 100).toFixed(1)}
                <span className="text-sm font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>%</span>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>NDCG@10</div>
              {badges[m]?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {badges[m].slice(0, 1).map(b => <Badge key={b} label={b} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Precision bar chart */}
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Precision@K</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chart_data.bar_data} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0efee" />
              <XAxis dataKey="k" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} domain={[0, 0.35]} tickFormatter={v => v.toFixed(2)} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={v => v.toFixed(4)} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
              {MODEL_ORDER.map(m => (
                <Bar key={m} dataKey={`${m}_precision`} name={m} fill={MODEL_HEXES[m]} radius={[3,3,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NDCG bar chart */}
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>NDCG@K</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chart_data.bar_data} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0efee" />
              <XAxis dataKey="k" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
              <YAxis tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} domain={[0, 0.40]} tickFormatter={v => v.toFixed(2)} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={v => v.toFixed(4)} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
              {MODEL_ORDER.map(m => (
                <Bar key={m} dataKey={`${m}_ndcg`} name={m} fill={MODEL_HEXES[m]} radius={[3,3,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar chart */}
      <div className="rounded-xl border bg-white p-5 mb-6" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Multi-Metric Comparison @10 (radar)</h3>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={[
              { metric: 'Precision', ...Object.fromEntries(chart_data.radar_data.map(r => [r.model, r.Precision])) },
              { metric: 'Recall', ...Object.fromEntries(chart_data.radar_data.map(r => [r.model, r.Recall])) },
              { metric: 'NDCG', ...Object.fromEntries(chart_data.radar_data.map(r => [r.model, r.NDCG])) },
              { metric: 'Hit Rate / 10', ...Object.fromEntries(chart_data.radar_data.map(r => [r.model, r['Hit Rate'] / 10])) },
            ]}>
              <PolarGrid stroke="#e4e3e1" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: '#78716c' }} />
              <PolarRadiusAxis angle={30} domain={[0, 40]} tick={{ fontSize: 9, fontFamily: 'IBM Plex Mono', fill: '#a8a29e' }} />
              {MODEL_ORDER.map(m => (
                <Radar key={m} name={m} dataKey={m} stroke={MODEL_HEXES[m]} fill={MODEL_HEXES[m]} fillOpacity={0.08} strokeWidth={1.5} />
              ))}
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={v => v.toFixed(2)} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <MetricTable metrics={metrics} badges={badges} />
    </div>
  )
}

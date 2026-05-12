import React, { useState } from 'react'
import { Database, Cpu, Server, ArrowRight, GitBranch, Layers, Zap } from 'lucide-react'
import { MODEL_COLORS } from '../lib/constants'

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {subtitle && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </div>
  )
}

function Box({ label, sublabel, icon: Icon, accent }) {
  return (
    <div className={`rounded-xl border bg-white px-4 py-3 text-center min-w-28 ${accent ? 'border-indigo-200 bg-indigo-50' : ''}`} style={{ borderColor: accent ? undefined : 'var(--border)' }}>
      {Icon && <Icon size={16} className={`mx-auto mb-1.5 ${accent ? 'text-indigo-500' : 'text-stone-400'}`} />}
      <div className={`text-xs font-medium ${accent ? 'text-indigo-700' : ''}`} style={{ color: accent ? undefined : 'var(--text-primary)' }}>{label}</div>
      {sublabel && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sublabel}</div>}
    </div>
  )
}

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 mx-1">
      <ArrowRight size={14} className="text-stone-300" />
      {label && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>}
    </div>
  )
}

function TrainingPipeline() {
  return (
    <div className="rounded-xl border bg-white p-6 mb-4" style={{ borderColor: 'var(--border)' }}>
      <SectionHeader title="Training Pipeline" subtitle="Offline training — models are pre-trained and weights saved to disk." />
      <div className="flex items-center flex-wrap gap-1">
        <Box label="Raw Data" sublabel="MovieLens-1M" icon={Database} />
        <Arrow label="preprocess" />
        <Box label="Split" sublabel="80/20 train/test" icon={GitBranch} />
        <Arrow label="train" />
        <Box label="Model Training" sublabel="PyTorch" icon={Cpu} accent />
        <Arrow label="save" />
        <Box label="Saved Weights" sublabel=".pt files" icon={Layers} />
      </div>
      <div className="mt-4 rounded-lg px-4 py-2.5 text-xs font-mono" style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
        # Models are loaded at startup — no retraining occurs during inference<br />
        models/ ├── fm_weights.pt ├── ncf_weights.pt ├── lightgcn_weights.pt └── proposed_weights.pt
      </div>
    </div>
  )
}

function InferencePipeline() {
  return (
    <div className="rounded-xl border bg-white p-6 mb-4" style={{ borderColor: 'var(--border)' }}>
      <SectionHeader title="Inference Pipeline" subtitle="Real-time recommendation serving via FastAPI." />
      <div className="flex items-center flex-wrap gap-1">
        <Box label="HTTP Request" sublabel="POST /api/compare" icon={Zap} />
        <Arrow label="route" />
        <Box label="FastAPI Router" sublabel="validate request" icon={Server} />
        <Arrow label="call" />
        <Box label="Model Registry" sublabel="in-memory" icon={Layers} accent />
        <Arrow label="predict" />
        <Box label="Top-K Items" sublabel="ranked scores" icon={Database} />
        <Arrow label="respond" />
        <Box label="JSON Response" sublabel="+ latency" icon={Zap} />
      </div>
    </div>
  )
}

function ModelArchCard({ name, layers }) {
  const color = MODEL_COLORS[name] || MODEL_COLORS.FM
  return (
    <div className="rounded-xl border bg-white p-5" style={{ borderColor: 'var(--border)' }}>
      <div className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-semibold mb-3 ${color.bg} ${color.text}`}>{name}</div>
      <div className="space-y-1.5">
        {layers.map((layer, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-mono bg-stone-100 text-stone-500 shrink-0">{i + 1}</div>
            <div className="flex-1">
              <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{layer.name}</div>
              {layer.detail && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{layer.detail}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MODEL_LAYERS = {
  FM: [
    { name: 'Input Layer', detail: 'User & Item embeddings + context features' },
    { name: 'Feature Interaction', detail: 'Pairwise FM dot product' },
    { name: 'Linear Layer', detail: 'Bias + first-order terms' },
    { name: 'Prediction', detail: 'Sum → sigmoid → score' },
  ],
  NCF: [
    { name: 'Embedding Layer', detail: 'User & Item ID embeddings (GMF + MLP)' },
    { name: 'GMF Path', detail: 'Element-wise product of embeddings' },
    { name: 'MLP Path', detail: '3× fully-connected layers with ReLU' },
    { name: 'NeuMF Fusion', detail: 'Concat GMF + MLP → softmax output' },
  ],
  LightGCN: [
    { name: 'User-Item Graph', detail: 'Bipartite interaction graph' },
    { name: 'Graph Convolution', detail: 'L layers of neighborhood aggregation' },
    { name: 'Layer Combination', detail: 'Weighted sum of all layer embeddings' },
    { name: 'Inner Product', detail: 'User ⊙ Item → BPR loss' },
  ],
  Proposed: [
    { name: 'Graph Encoder', detail: 'LightGCN backbone for structural signal' },
    { name: 'Attention Layer', detail: 'Multi-head self-attention on embeddings' },
    { name: 'Feature Interaction', detail: 'FM-style cross feature interactions' },
    { name: 'Fusion & Output', detail: 'Gated combination → final score' },
  ],
}

export default function ArchitecturePage() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1.5 tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>System Architecture</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Training pipeline, inference flow, and per-model architecture overview.</p>
      </div>

      <TrainingPipeline />
      <InferencePipeline />

      {/* System overview */}
      <div className="rounded-xl border bg-white p-6 mb-6" style={{ borderColor: 'var(--border)' }}>
        <SectionHeader title="System Overview" subtitle="Frontend ↔ Backend ↔ Model Registry" />
        <div className="flex items-center flex-wrap gap-1 mb-4">
          <Box label="React Frontend" sublabel="Vite + Tailwind" icon={Layers} />
          <Arrow label="axios" />
          <Box label="FastAPI" sublabel=":8000" icon={Server} accent />
          <Arrow label="load" />
          <Box label="Model Registry" sublabel="4× PyTorch models" icon={Cpu} accent />
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-subtle)' }}>
            <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Frontend Routes</div>
            {['/ — Overview', '/compare — Model Comparison', '/metrics — Evaluation', '/architecture — This page'].map(r => (
              <div key={r} className="font-mono py-0.5" style={{ color: 'var(--text-secondary)' }}>{r}</div>
            ))}
          </div>
          <div className="rounded-lg p-3" style={{ background: 'var(--bg-subtle)' }}>
            <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Backend Endpoints</div>
            {['GET /api/models', 'GET /api/users', 'POST /api/recommend', 'POST /api/compare', 'GET /api/metrics'].map(r => (
              <div key={r} className="font-mono py-0.5" style={{ color: 'var(--text-secondary)' }}>{r}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-model architectures */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>Model Architectures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(MODEL_LAYERS).map(([name, layers]) => (
            <ModelArchCard key={name} name={name} layers={layers} />
          ))}
        </div>
      </div>
    </div>
  )
}

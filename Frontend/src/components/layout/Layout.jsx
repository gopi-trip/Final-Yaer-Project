import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, GitCompare, BarChart3, Network, ChevronRight, Cpu } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/compare', label: 'Compare Models', icon: GitCompare },
  { to: '/metrics', label: 'Metrics', icon: BarChart3 },
  { to: '/architecture', label: 'Architecture', icon: Network },
]

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Cpu size={14} className="text-white" />
            </div>
            <div>
              <div className="font-display text-sm font-700 leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>RecSys</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Research Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group',
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
                )}
              >
                <Icon size={15} className={active ? 'text-indigo-600' : 'text-stone-400 group-hover:text-stone-600'} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto text-indigo-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Dataset badge */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
            <div className="font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}>Dataset</div>
            <div>MovieLens-1M</div>
            <div>6,040 users · 3,706 items</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

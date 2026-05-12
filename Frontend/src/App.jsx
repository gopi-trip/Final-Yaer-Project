import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ComparePage from './pages/ComparePage'
import MetricsPage from './pages/MetricsPage'
import ArchitecturePage from './pages/ArchitecturePage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
      </Routes>
    </Layout>
  )
}

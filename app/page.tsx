'use client'

import React from 'react'
import LLMVisualization from './components/LLMVisualization'
import DebugPanel from './components/DebugPanel'
import P5ScriptLoader from './components/P5ScriptLoader'

export default function Home() {
  const handleP5Loaded = () => {
    console.log("p5.js loaded callback triggered at page level")
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <P5ScriptLoader onLoad={handleP5Loaded} />
      <LLMVisualization />
      <DebugPanel />
    </main>
  )
} 
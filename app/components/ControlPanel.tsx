'use client'

import React, { Dispatch, SetStateAction, useEffect } from 'react'

interface ControlPanelProps {
  visible: boolean
  isPaused: boolean
  setIsPaused: Dispatch<SetStateAction<boolean>>
  phase: number
  setPhase: Dispatch<SetStateAction<number>>
  animationSpeed: number
  setAnimationSpeed: Dispatch<SetStateAction<number>>
  showAttentionMaps: boolean
  setShowAttentionMaps: Dispatch<SetStateAction<boolean>>
  advancedMode: boolean
  setAdvancedMode: Dispatch<SetStateAction<boolean>>
}

const MAX_PHASES = 7

const ControlPanel = ({
  visible,
  isPaused,
  setIsPaused,
  phase,
  setPhase,
  animationSpeed,
  setAnimationSpeed,
  showAttentionMaps,
  setShowAttentionMaps,
  advancedMode,
  setAdvancedMode
}: ControlPanelProps) => {
  useEffect(() => {
    console.log('ControlPanel mounted with props:', { 
      visible, isPaused, phase, animationSpeed, showAttentionMaps, advancedMode 
    })
  }, [visible, isPaused, phase, animationSpeed, showAttentionMaps, advancedMode])

  if (!visible) {
    console.log('ControlPanel is hidden')
    return null
  }

  console.log('ControlPanel is rendering')
  
  const handlePrevPhase = () => {
    if (phase > 0) {
      setPhase(phase - 1)
    }
  }
  
  const handleNextPhase = () => {
    if (phase < MAX_PHASES - 1) {
      setPhase(phase + 1)
    }
  }
  
  const handlePhaseSelect = (selectedPhase: number) => {
    setPhase(selectedPhase)
  }
  
  return (
    <div 
      className={`absolute top-0 right-0 w-1/5 p-4 bg-[#151a25] bg-opacity-90 border-l border-[#3c64aa4d] z-10 flex flex-col gap-2.5 transition-transform duration-300 ease-in-out h-full overflow-y-auto ${!visible ? 'translate-x-full' : ''}`}
    >
      <h3 className="text-base font-semibold text-blue-100 mb-1">Controls</h3>
      
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button 
          className="py-2 px-4 bg-blue-600 bg-opacity-20 text-blue-100 border border-blue-600 border-opacity-50 rounded text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-opacity-40 hover:shadow-[0_0_10px_rgba(80,120,200,0.6)]"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? '▶️ Play' : '⏸️ Pause'}
        </button>
        <button 
          className="py-2 px-4 bg-blue-600 bg-opacity-20 text-blue-100 border border-blue-600 border-opacity-50 rounded text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-opacity-40 hover:shadow-[0_0_10px_rgba(80,120,200,0.6)]"
          onClick={() => setPhase(0)}
        >
          🔄 Restart
        </button>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <button 
          className={`py-2 px-4 bg-blue-600 bg-opacity-20 text-blue-100 border border-blue-600 border-opacity-50 rounded text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-opacity-40 hover:shadow-[0_0_10px_rgba(80,120,200,0.6)] ${phase === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePrevPhase}
          disabled={phase === 0}
        >
          ◀ Previous Phase
        </button>
        <button 
          className={`py-2 px-4 bg-blue-600 bg-opacity-20 text-blue-100 border border-blue-600 border-opacity-50 rounded text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-opacity-40 hover:shadow-[0_0_10px_rgba(80,120,200,0.6)] ${phase === MAX_PHASES - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNextPhase}
          disabled={phase === MAX_PHASES - 1}
        >
          Next Phase ▶
        </button>
      </div>
      
      <div className="mt-4">
        <div className="flex flex-col gap-1.5 w-full">
          <div className="text-xs text-blue-100">Animation Speed</div>
          <input 
            type="range" 
            min="0.2" 
            max="2" 
            step="0.1" 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>
      
      <div className="flex gap-2 mt-2">
        <button 
          className={`py-2 px-3 text-xs flex-1 bg-blue-600 border border-blue-600 border-opacity-50 rounded transition-all duration-300 hover:bg-opacity-40 hover:shadow-[0_0_10px_rgba(80,120,200,0.6)] ${showAttentionMaps ? 'bg-opacity-40 text-white shadow-[0_0_10px_rgba(80,120,200,0.6)]' : 'bg-opacity-20 text-blue-100'}`}
          onClick={() => setShowAttentionMaps(!showAttentionMaps)}
        >
          Show Attention Maps
        </button>
        <button 
          className={`py-2 px-3 text-xs flex-1 bg-blue-600 border border-blue-600 border-opacity-50 rounded transition-all duration-300 hover:bg-opacity-40 hover:shadow-[0_0_10px_rgba(80,120,200,0.6)] ${advancedMode ? 'bg-opacity-40 text-white shadow-[0_0_10px_rgba(80,120,200,0.6)]' : 'bg-opacity-20 text-blue-100'}`}
          onClick={() => setAdvancedMode(!advancedMode)}
        >
          Advanced Mode
        </button>
      </div>
      
      <div className="mt-6 pt-4 border-t border-[#6488ff4d]">
        <div className="text-xs text-blue-100 mb-2">Jump to Phase:</div>
        <div className="flex flex-wrap gap-1.5">
          {[
            "1. Init", 
            "2. Tokens", 
            "3. Layers", 
            "4. Attention", 
            "5. Output", 
            "6. Projection", 
            "7. Generation"
          ].map((name, idx) => (
            <button 
              key={idx}
              className={`text-xs py-1.5 px-1 flex-1 basis-[calc(50%-3px)] text-center bg-blue-600 border border-blue-600 border-opacity-30 rounded transition-all duration-200 ${phase === idx ? 'bg-opacity-40 shadow-[0_0_8px_rgba(80,140,255,0.6)] text-white' : 'bg-opacity-20 text-blue-100 hover:bg-opacity-30'}`}
              onClick={() => handlePhaseSelect(idx)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ControlPanel 
'use client'

import { useEffect, useRef, useState } from 'react'
import InfoPanel from './InfoPanel'
import ControlPanel from './ControlPanel'
import AttentionVisualization from './AttentionVisualization'
import LayerDetailPanel from './LayerDetailPanel'
import Tooltip from './Tooltip'

// Import p5 as a client component
import dynamic from 'next/dynamic'
const P5Wrapper = dynamic(() => import('./P5Wrapper'), { ssr: false })

const LLMVisualization = () => {
  console.log('LLMVisualization component rendering')
  
  const [isPanelVisible, setIsPanelVisible] = useState(true)
  const [isControlVisible, setIsControlVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [phase, setPhase] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showAttentionMaps, setShowAttentionMaps] = useState(false)
  const [advancedMode, setAdvancedMode] = useState(false)
  
  useEffect(() => {
    console.log('LLMVisualization mounted')
    console.log('Initial state:', {
      isPanelVisible,
      isControlVisible,
      isPaused,
      phase,
      animationSpeed,
      showAttentionMaps,
      advancedMode
    })
    
    // Check if we're running in the browser environment
    console.log('Window object available:', typeof window !== 'undefined')
    console.log('Document object available:', typeof document !== 'undefined')
    
    // Listen for phase advancement events from the P5Wrapper
    const handleAdvancePhase = (e: any) => {
      console.log('Received phase advancement event:', e.detail)
      if (!isPaused) {
        setPhase(e.detail.nextPhase)
      }
    }
    
    window.addEventListener('advancePhase', handleAdvancePhase)
    
    return () => {
      console.log('LLMVisualization unmounting')
      window.removeEventListener('advancePhase', handleAdvancePhase)
    }
  }, [isPanelVisible, isControlVisible, isPaused, phase, animationSpeed, showAttentionMaps, advancedMode])
  
  return (
    <>
      {/* Toggle Buttons */}
      <button 
        className="absolute top-2.5 left-2.5 z-20 p-1 w-6 h-6 flex items-center justify-center text-xs bg-opacity-20 bg-blue-600 text-blue-100 border border-opacity-50 border-blue-600 rounded"
        onClick={() => setIsPanelVisible(!isPanelVisible)}
      >
        ≡
      </button>
      
      <button 
        className="absolute top-2.5 right-2.5 z-20 p-1 w-6 h-6 flex items-center justify-center text-xs bg-opacity-20 bg-blue-600 text-blue-100 border border-opacity-50 border-blue-600 rounded"
        onClick={() => setIsControlVisible(!isControlVisible)}
      >
        ≡
      </button>
      
      {/* Main Content */}
      <div id="mainContent" className="absolute left-[20%] w-[60%] h-full">
        <P5Wrapper 
          phase={phase}
          isPaused={isPaused}
          animationSpeed={animationSpeed}
          showAttentionMaps={showAttentionMaps}
          advancedMode={advancedMode}
        />
      </div>
      
      {/* Panels */}
      <InfoPanel visible={isPanelVisible} phase={phase} />
      
      <ControlPanel 
        visible={isControlVisible}
        isPaused={isPaused} 
        setIsPaused={setIsPaused}
        phase={phase}
        setPhase={setPhase}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        showAttentionMaps={showAttentionMaps}
        setShowAttentionMaps={setShowAttentionMaps}
        advancedMode={advancedMode}
        setAdvancedMode={setAdvancedMode}
      />
      
      <AttentionVisualization visible={showAttentionMaps} />
      <LayerDetailPanel />
      <Tooltip />
    </>
  )
}

export default LLMVisualization 
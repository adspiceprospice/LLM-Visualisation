'use client'

import { useEffect, useRef } from 'react'

interface AttentionVisualizationProps {
  visible: boolean
}

const AttentionVisualization = ({ visible }: AttentionVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // In a real implementation, this would receive attention data
  // and render it on the canvas
  
  return (
    <div 
      className={`absolute bottom-5 left-[calc(20%+5px)] w-60 h-50 bg-[#151a25] bg-opacity-85 border border-[#3c64aa4d] rounded p-2.5 ${visible ? 'block' : 'hidden'}`}
    >
      <div className="text-sm font-bold mb-1 text-blue-100 text-center">
        Attention Patterns
      </div>
      <canvas
        ref={canvasRef}
        id="attentionCanvas" 
        width="280" 
        height="170"
        className="w-full h-auto"
      />
    </div>
  )
}

export default AttentionVisualization 
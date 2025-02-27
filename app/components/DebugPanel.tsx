'use client'

import { useState, useEffect } from 'react'

interface DebugPanelProps {
  visible?: boolean
}

const DebugPanel = ({ visible = true }: DebugPanelProps) => {
  const [logs, setLogs] = useState<string[]>([])
  const [isP5Available, setIsP5Available] = useState<boolean>(false)
  const [containerInfo, setContainerInfo] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  // Check if p5 is available
  useEffect(() => {
    const checkP5 = () => {
      const p5Available = typeof window !== 'undefined' && 'p5' in window
      setIsP5Available(p5Available)
      
      // Check if there's a canvas element created by p5
      const p5Canvas = document.querySelector('canvas')
      const canvasExists = !!p5Canvas
      
      addLog(`p5.js available: ${p5Available}, Canvas exists: ${canvasExists}`)
      
      if (canvasExists) {
        addLog(`Canvas dimensions: ${p5Canvas.width}x${p5Canvas.height}`)
      }
    }

    // Check immediately and then every second
    checkP5()
    const interval = setInterval(checkP5, 1000)

    return () => clearInterval(interval)
  }, [])

  // Check container dimensions
  useEffect(() => {
    const checkContainer = () => {
      const container = document.getElementById('p5-container')
      if (container) {
        const info = {
          offsetWidth: container.offsetWidth,
          offsetHeight: container.offsetHeight,
          clientWidth: container.clientWidth,
          clientHeight: container.clientHeight,
          children: container.children.length
        }
        setContainerInfo(info)
        addLog(`Container dimensions: ${JSON.stringify(info)}`)
      } else {
        setContainerInfo(null)
        addLog('Container not found')
      }
    }

    // Check immediately and then every second
    checkContainer()
    const interval = setInterval(checkContainer, 1000)

    return () => clearInterval(interval)
  }, [])

  const addLog = (message: string) => {
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, `[${new Date().toISOString()}] ${message}`]
      // Keep only the last 10 logs
      return newLogs.slice(-10)
    })
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 z-50 p-2 bg-black bg-opacity-80 text-white text-xs w-full md:w-auto">
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold">Debug Panel</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2 py-1 bg-blue-600 rounded text-xs"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="mb-2">
            <div>p5.js available: <span className={isP5Available ? 'text-green-400' : 'text-red-400'}>
              {isP5Available ? 'Yes' : 'No'}
            </span></div>
            
            <div>Container: <span className={containerInfo ? 'text-green-400' : 'text-red-400'}>
              {containerInfo ? 'Found' : 'Not found'}
            </span></div>
            
            {containerInfo && (
              <div className="ml-2">
                <div>Width: {containerInfo.offsetWidth}px</div>
                <div>Height: {containerInfo.offsetHeight}px</div>
                <div>Children: {containerInfo.children}</div>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-700 pt-1">
            <div className="font-bold mb-1">Recent Logs:</div>
            <div className="max-h-32 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="truncate hover:whitespace-normal">{log}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DebugPanel 
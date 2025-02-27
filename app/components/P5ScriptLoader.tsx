'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface P5ScriptLoaderProps {
  onLoad?: () => void
}

const P5ScriptLoader = ({ onLoad }: P5ScriptLoaderProps) => {
  // Handle script load
  const handleScriptLoad = () => {
    console.log("p5.js loaded from P5ScriptLoader")
    if (onLoad) onLoad()
  }

  // Handle script error
  const handleScriptError = () => {
    console.error("Failed to load p5.js from script tag")
    
    // Try to load p5.js dynamically as a fallback
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js'
      script.async = true
      script.onload = () => {
        console.log("p5.js loaded through fallback mechanism")
        if (onLoad) onLoad()
      }
      script.onerror = () => {
        console.error("Failed to load p5.js through fallback")
      }
      document.head.appendChild(script)
    }
  }

  // Verify p5 loaded correctly
  useEffect(() => {
    // Check if p5 is available after a short delay
    const timer = setTimeout(() => {
      const p5Available = typeof window !== 'undefined' && 'p5' in window
      console.log("p5.js availability check:", p5Available)
      
      if (!p5Available) {
        console.warn("p5.js was not detected after loading script, trying fallback")
        handleScriptError()
      }
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <Script 
      src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js" 
      strategy="beforeInteractive"
      onLoad={handleScriptLoad}
      onError={handleScriptError}
    />
  )
}

export default P5ScriptLoader 
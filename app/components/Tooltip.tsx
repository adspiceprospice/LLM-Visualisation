'use client'

import { useEffect, useState } from 'react'

const Tooltip = () => {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  return (
    <div 
      id="tooltip" 
      className="tooltip absolute p-2 bg-black bg-opacity-80 border border-[#64a0ff80] rounded text-xs text-white pointer-events-none z-[100] max-w-[250px] opacity-0 transition-opacity duration-200"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`
      }}
    >
      {content}
    </div>
  )
}

export default Tooltip 
'use client'

import { useState } from 'react'

const LayerDetailPanel = () => {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState('')
  
  return (
    <div 
      id="layerDetailPanel" 
      className={`layer-detail absolute p-2.5 bg-[#1e283c] bg-opacity-90 border border-[#64a0ff80] rounded-md w-[300px] z-20 ${visible ? 'block' : 'hidden'}`}
    >
      <span 
        className="detail-close absolute top-1 right-1 cursor-pointer text-blue-100"
        onClick={() => setVisible(false)}
      >
        ✕
      </span>
      <div 
        id="layerDetailContent" 
        className="text-xs"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default LayerDetailPanel 
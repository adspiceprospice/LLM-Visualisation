'use client'

import Script from 'next/script'
import { ReactNode } from 'react'

interface ClientScriptProps {
  src: string
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload'
  onLoad?: () => void
  onError?: () => void
  children?: ReactNode
}

const ClientScript = ({ 
  src, 
  strategy = 'afterInteractive', 
  onLoad, 
  onError,
  children 
}: ClientScriptProps) => {
  return (
    <>
      <Script 
        src={src} 
        strategy={strategy}
        onLoad={onLoad}
        onError={onError}
      />
      {children}
    </>
  )
}

export default ClientScript 
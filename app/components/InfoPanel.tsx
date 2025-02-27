'use client'

import React, { useEffect } from 'react'

interface InfoPanelProps {
  visible: boolean
  phase: number
}

const phaseDescriptions = [
  "Setting up the model architecture with transformer layers, attention heads, feed-forward networks, and normalization components. The diagram shows a simplified version of the full architecture, which contains 24 transformer layers with 16 attention heads each.",
  
  "Converting input text into tokens (atomic units of text) and creating embedding vectors - high-dimensional numerical representations that capture semantic meaning. Each token is transformed into a vector of size 4096, which allows the model to understand and process language. Positional encodings are also added to give the model awareness of token order.",
  
  "Processing tokens through multiple transformer layers, which are the core computational blocks of LLMs. Each layer builds increasingly abstract and context-aware representations of the input. The model shown has 24 layers, progressively refining the understanding of the text context.",
  
  "Focusing on the attention mechanism, which allows the model to weigh the importance of different tokens when processing each token. Multi-head attention allows the model to attend to different patterns simultaneously, capturing various linguistic and semantic relationships.",
  
  "Generating token probabilities for the next word, calculated based on the processed information from transformer layers. The model computes probabilities across its entire vocabulary (typically 50,000+ tokens) based on the context provided.",
  
  "Projecting and sampling from output probabilities to select the most appropriate next token. This involves converting the final layer's hidden states back to vocabulary space and selecting the most likely token (or sampling based on a temperature parameter).",
  
  "Creating the complete response through an autoregressive process. Each generated token becomes part of the context for producing the next token, in a recursive process that continues until a stopping condition is met."
]

const phaseNames = [
  "Phase: Initialization",
  "Phase: Tokenization & Embedding",
  "Phase: Processing Through Layers",
  "Phase: Attention Mechanism",
  "Phase: Output Probabilities",
  "Phase: Token Projection",
  "Phase: Text Generation"
]

const InfoPanel = ({ visible, phase }: InfoPanelProps) => {
  useEffect(() => {
    console.log('InfoPanel mounted with props:', { visible, phase })
  }, [visible, phase])

  if (!visible) {
    console.log('InfoPanel is hidden')
    return null
  }

  console.log('InfoPanel is rendering with phase:', phase)

  return (
    <div 
      id="infoPanel" 
      className={`absolute top-0 left-0 w-1/5 h-full p-4 bg-[#151a25] bg-opacity-90 border-r border-[#3c64aa4d] text-sm leading-relaxed overflow-y-auto transition-transform duration-300 ease-in-out ${!visible ? '-translate-x-full' : ''}`}
    >
      <div id="phaseName" className="font-bold mb-2 text-white text-base">
        {phaseNames[phase]}
      </div>
      <div id="phaseDescription" className="mb-4 text-xs text-gray-200">
        {phaseDescriptions[phase]}
      </div>
      <div id="componentInfo" className="mt-4">
        {phase === 0 && (
          <div className="component-info bg-[#28324770] rounded p-2.5 mt-2.5 border-l-2 border-[#508cf0cc] text-xs">
            <div className="info-title font-bold mb-1 text-[#a0c8ff]">Transformer Architecture</div>
            <p>The visualization shows a simplified transformer architecture. In reality, large language models can have billions of parameters across dozens of layers.</p>
          </div>
        )}
        {phase === 1 && (
          <div className="component-info bg-[#28324770] rounded p-2.5 mt-2.5 border-l-2 border-[#508cf0cc] text-xs">
            <div className="info-title font-bold mb-1 text-[#a0c8ff]">Embeddings</div>
            <p>Token embeddings convert words into high-dimensional vectors that capture semantic meaning. These vectors allow the model to process language mathematically.</p>
          </div>
        )}
        {phase >= 2 && (
          <div className="component-info bg-[#28324770] rounded p-2.5 mt-2.5 border-l-2 border-[#508cf0cc] text-xs">
            <div className="info-title font-bold mb-1 text-[#a0c8ff]">Key Components</div>
            <p><span className="text-[#a0c8ff]">Attention Heads:</span> Calculate relevance between tokens</p>
            <p><span className="text-[#a0c8ff]">Feed-Forward Networks:</span> Process token representations</p>
            <p><span className="text-[#a0c8ff]">Layer Normalization:</span> Stabilizes training</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoPanel 
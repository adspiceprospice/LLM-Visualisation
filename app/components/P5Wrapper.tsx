'use client'

import { useEffect, useRef, useState } from 'react'
import { loadP5, isP5Available } from '../utils/loadP5'

interface P5WrapperProps {
  phase: number
  isPaused: boolean
  animationSpeed: number
  showAttentionMaps: boolean
  advancedMode: boolean
}

// Define p5 globals
declare global {
  interface Window {
    p5: any
  }
}

const P5Wrapper = ({ 
  phase, 
  isPaused, 
  animationSpeed, 
  showAttentionMaps, 
  advancedMode 
}: P5WrapperProps) => {
  console.log('P5Wrapper rendering with props:', { phase, isPaused, animationSpeed, showAttentionMaps, advancedMode })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const [p5Loaded, setP5Loaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const p5InstanceRef = useRef<any>(null)
  
  // Load p5.js dynamically
  useEffect(() => {
    console.log("P5Wrapper mounted, container exists:", !!containerRef.current)
    if (containerRef.current) {
      console.log("Container dimensions:", {
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
        clientWidth: containerRef.current.clientWidth,
        clientHeight: containerRef.current.clientHeight
      })
    }
    
    // Check if p5 is already available (might have been loaded by another component)
    if (isP5Available()) {
      console.log("p5.js already available on mount")
      setP5Loaded(true)
      return
    }
    
    // Load p5.js dynamically
    loadP5()
      .then(() => {
        console.log("p5.js loaded successfully via dynamic loader")
        setP5Loaded(true)
      })
      .catch(error => {
        console.error("Failed to load p5.js:", error)
        setLoadError("Failed to load p5.js library. Please try refreshing the page.")
      })
    
    return () => {
      console.log("P5Wrapper unmounting")
      if (p5InstanceRef.current) {
        console.log("Removing p5 instance on unmount")
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
  }, [])
  
  // Initialize p5 sketch when p5 is loaded
  useEffect(() => {
    // Only initialize if p5 is loaded and container exists
    if (!p5Loaded || !containerRef.current) {
      console.log("Skipping p5 initialization:", { 
        p5Loaded, 
        containerExists: !!containerRef.current 
      })
      return
    }
    
    console.log("Starting p5.js initialization")
    console.log("Container dimensions before init:", {
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight
    })
    
    // Initialize p5.js when the component mounts
    const sketch = (p: any) => {
      // Animation state
      let phaseTime = 0
      let tokenIndex = 0
      let generationIndex = 0
      
      // Architecture configuration
      const numLayers = 24
      const numHeads = 16
      const hiddenDim = 4096
      const vocabSize = 50000
      const ffnDim = 16384
      
      // Layout constants
      let STAGE_WIDTH: number, STAGE_HEIGHT: number
      let INPUT_X: number, LAYERS_X: number, OUTPUT_X: number
      let HEADER_Y: number, CONTENT_Y: number, CONTENT_HEIGHT: number, FOOTER_Y: number
      let sectionWidth: number
      
      // Colors
      const COLORS = {
        background: [21, 26, 37],
        panel: [30, 40, 60],
        panelBorder: [60, 100, 170, 50],
        inputToken: [70, 130, 210],
        layerBase: [40, 70, 120],
        layerAccent: [80, 140, 255],
        attentionHead: [120, 180, 255],
        attentionLine: [160, 210, 255, 30],
        outputToken: [70, 180, 120],
        outputAccent: [100, 255, 150],
        text: [220, 230, 240],
        dimText: [180, 190, 200],
        highlight: [255, 200, 100],
        ffn: [255, 140, 80],
        positionalEncoding: [180, 120, 220],
        normalization: [220, 220, 100]
      }
      
      // Animation elements
      let inputTokens: any[] = []
      let embeddings: any[] = []
      let layers: any[] = []
      let attentionPatterns: any[] = []
      let outputTokens: any[] = []
      let flowParticles: any[] = []
      let attentionMaps: any[] = []
      let tokenProbabilities: any[] = []
      
      // Input prompt and generated code
      const inputPrompt = "Create a p5js graphical animation"
      const tokenizedPrompt = inputPrompt.split(/\b/).filter((t: string) => t.trim().length > 0)
      
      const outputCode = [
        "function setup() {",
        "  createCanvas(800, 600);",
        "  background(10);",
        "}",
        "",
        "function draw() {",
        "  background(10, 20);",
        "  // Draw animation elements",
        "  drawParticles();",
        "  updatePhysics();",
        "}"
      ]
      
      let hoveredElement: any = null
      let selectedElement: any = null
      let attentionMapLayer = 0
      let attentionMapHead = 0
      
      // Setup function - runs once at the beginning
      p.setup = () => {
        console.log("p5 setup running", containerRef.current?.offsetWidth, containerRef.current?.offsetHeight)
        
        try {
          // Create canvas that fills the container
          const canvas = p.createCanvas(
            containerRef.current?.offsetWidth || 800, 
            containerRef.current?.offsetHeight || 600
          )
          console.log("Canvas created with dimensions:", p.width, p.height)
          
          // Basic p5 setup
          p.frameRate(60)
          p.textFont('Arial, sans-serif')
          
          // Initialize the layout
          resetLayout()
          
          // Create visual elements
          createInputTokens()
          createLayers()
          createOutputTokens()
          createAttentionPatterns()
          createTokenProbabilities()
          
          console.log("p5 setup completed successfully")
        } catch (error) {
          console.error("Error in p5 setup:", error)
        }
      }
      
      // Draw function - runs every frame
      p.draw = () => {
        try {
          // Clear background
          p.background(...COLORS.background)
          
          // Update phase time if not paused
          if (!isPaused) {
            phaseTime += 0.016 * animationSpeed // approximately 60fps
          }
          
          // Update and render based on current phase
          updatePhase()
          
          // Draw all elements
          drawInputTokens()
          drawEmbeddings()
          drawLayers()
          drawAttentionPatterns()
          drawOutputTokens()
          drawTokenProbabilities()
          
          // Draw phase indicator/progress bar
          drawPhaseIndicator()
          
          // Update flow particles
          updateFlowParticles()
        } catch (error) {
          console.error("Error in p5 draw:", error)
        }
      }
      
      // Reset layout when size changes
      const resetLayout = () => {
        STAGE_WIDTH = p.width
        STAGE_HEIGHT = p.height
        
        HEADER_Y = STAGE_HEIGHT * 0.1
        CONTENT_Y = STAGE_HEIGHT * 0.2
        CONTENT_HEIGHT = STAGE_HEIGHT * 0.6
        FOOTER_Y = STAGE_HEIGHT * 0.85
        
        sectionWidth = STAGE_WIDTH / 5
        
        INPUT_X = sectionWidth
        LAYERS_X = STAGE_WIDTH / 2
        OUTPUT_X = STAGE_WIDTH - sectionWidth
        
        console.log("Layout reset with dimensions:", {
          STAGE_WIDTH, STAGE_HEIGHT, CONTENT_HEIGHT, sectionWidth
        })
      }
      
      // Create input tokens
      const createInputTokens = () => {
        console.log("Creating input tokens with:", {
          tokenizedPrompt: tokenizedPrompt.length,
          INPUT_X,
          CONTENT_Y
        })
        
        inputTokens = []
        for (let i = 0; i < tokenizedPrompt.length; i++) {
          inputTokens.push({
            text: tokenizedPrompt[i],
            x: INPUT_X,
            y: CONTENT_Y + 40 * i,
            opacity: 0,
            activated: false
          })
        }
        console.log("Input tokens created:", inputTokens.length)
      }
      
      // Create transformer layers
      const createLayers = () => {
        console.log("Creating layers with:", {
          numLayers,
          CONTENT_HEIGHT,
          LAYERS_X,
          CONTENT_Y
        })
        
        layers = []
        const visibleLayers = Math.min(numLayers, 6)
        const spacing = CONTENT_HEIGHT / (visibleLayers + 1)
        
        for (let i = 0; i < visibleLayers; i++) {
          const y = CONTENT_Y + spacing * (i + 1)
          layers.push({
            index: i,
            x: LAYERS_X,
            y: y,
            width: 150,
            height: 50,
            opacity: 0,
            attentionHeads: [],
            ffn: { activated: false, opacity: 0 },
            normalization: { activated: false, opacity: 0 }
          })
          
          // Add attention heads
          const visibleHeads = Math.min(numHeads, 6)
          for (let h = 0; h < visibleHeads; h++) {
            const headAngle = (h / visibleHeads) * Math.PI - Math.PI / 2
            const headRadius = 70
            const headX = LAYERS_X + Math.cos(headAngle) * headRadius
            const headY = y + Math.sin(headAngle) * headRadius / 2
            
            layers[i].attentionHeads.push({
              index: h,
              x: headX,
              y: headY,
              radius: 15,
              opacity: 0,
              activated: false
            })
          }
        }
        console.log("Layers created:", layers.length, "with attention heads per layer:", layers[0]?.attentionHeads.length || 0)
      }
      
      // Create output tokens
      const createOutputTokens = () => {
        outputTokens = []
        for (let i = 0; i < outputCode.length; i++) {
          outputTokens.push({
            text: outputCode[i],
            x: OUTPUT_X,
            y: CONTENT_Y + 25 * i,
            opacity: 0,
            activated: false,
            generating: false
          })
        }
      }
      
      // Create attention patterns between tokens
      const createAttentionPatterns = () => {
        console.log("Creating attention patterns")
        attentionPatterns = []
        
        // Make sure we have layers and input tokens
        if (layers.length === 0 || inputTokens.length === 0) {
          console.warn("Cannot create attention patterns - missing layers or input tokens")
          return
        }
        
        // Create patterns for each layer and head
        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i]
          
          // Skip if the layer doesn't have attentionHeads
          if (!layer.attentionHeads || layer.attentionHeads.length === 0) {
            console.warn(`Layer ${i} has no attention heads`)
            continue
          }
          
          for (let h = 0; h < layer.attentionHeads.length; h++) {
            // Create different pattern types for each head to make visualization more interesting
            if (i === 0) {
              // First layer heads focus on local patterns and adjacent tokens
              for (let t = 0; t < inputTokens.length; t++) {
                // Self-attention
                attentionPatterns.push({
                  layerIndex: i,
                  headIndex: h,
                  fromToken: t,
                  toToken: t,
                  strength: 0.7 + Math.random() * 0.3,
                  opacity: 0,
                  active: false
                })
                
                // Attend to adjacent tokens (if they exist)
                if (t > 0) {
                  attentionPatterns.push({
                    layerIndex: i,
                    headIndex: h,
                    fromToken: t,
                    toToken: t - 1,
                    strength: 0.4 + Math.random() * 0.3,
                    opacity: 0,
                    active: false
                  })
                }
                
                if (t < inputTokens.length - 1) {
                  attentionPatterns.push({
                    layerIndex: i,
                    headIndex: h,
                    fromToken: t,
                    toToken: t + 1,
                    strength: 0.4 + Math.random() * 0.3,
                    opacity: 0,
                    active: false
                  })
                }
              }
            } else if (i === 1) {
              // Second layer - some heads look at key words, others at local patterns
              const keyTokenIndices = [0, 2, 4].filter(idx => idx < inputTokens.length)
              
              if (h % 2 === 0) {
                // Even heads focus on key words
                for (let t = 0; t < inputTokens.length; t++) {
                  for (let keyIdx of keyTokenIndices) {
                    attentionPatterns.push({
                      layerIndex: i,
                      headIndex: h,
                      fromToken: t,
                      toToken: keyIdx,
                      strength: 0.5 + Math.random() * 0.5,
                      opacity: 0,
                      active: false
                    })
                  }
                }
              } else {
                // Odd heads focus on broader context
                for (let t = 0; t < inputTokens.length; t++) {
                  for (let t2 = 0; t2 < inputTokens.length; t2++) {
                    if (Math.abs(t - t2) <= 2) { // Within 2 positions
                      attentionPatterns.push({
                        layerIndex: i,
                        headIndex: h,
                        fromToken: t,
                        toToken: t2,
                        strength: 0.3 + Math.random() * 0.4,
                        opacity: 0,
                        active: false
                      })
                    }
                  }
                }
              }
            } else {
              // Higher layers - mixture of patterns with focus on global context
              // Create some fully connected patterns for later layers
              for (let t = 0; t < inputTokens.length; t++) {
                // Each token attends to a few random tokens
                const numTargets = 2 + Math.floor(Math.random() * 3) // 2-4 targets
                const targets = new Set<number>()
                
                // Always include self-attention
                targets.add(t)
                
                // Add some random targets
                while (targets.size < Math.min(numTargets, inputTokens.length)) {
                  targets.add(Math.floor(Math.random() * inputTokens.length))
                }
                
                // Convert set to array and create patterns
                Array.from(targets).forEach(targetIdx => {
                  attentionPatterns.push({
                    layerIndex: i,
                    headIndex: h,
                    fromToken: t,
                    toToken: targetIdx,
                    strength: 0.3 + Math.random() * 0.7,
                    opacity: 0,
                    active: false
                  })
                })
              }
            }
          }
        }
        
        console.log(`Created ${attentionPatterns.length} attention patterns across ${layers.length} layers`)
      }
      
      // Create token probabilities for the output phase
      const createTokenProbabilities = () => {
        tokenProbabilities = []
        const numBars = 20
        const spacing = 15
        const totalWidth = numBars * spacing
        const startX = OUTPUT_X - totalWidth / 2
        
        for (let i = 0; i < numBars; i++) {
          const height = 10 + Math.random() * 80
          tokenProbabilities.push({
            x: startX + i * spacing,
            y: FOOTER_Y,
            width: 10,
            height: height,
            maxHeight: height,
            opacity: 0,
            highlighted: i === 5, // Highlight the "selected" token
            text: i === 5 ? "function" : ""
          })
        }
      }
      
      // Create a flow particle
      const createFlowParticle = () => {
        const startTokenIndex = Math.floor(Math.random() * inputTokens.length)
        const startToken = inputTokens[startTokenIndex]
        
        if (startToken.opacity < 200) return // Only create particles for visible tokens
        
        const targetLayerIndex = Math.floor(Math.random() * layers.length)
        const targetLayer = layers[targetLayerIndex]
        
        flowParticles.push({
          x: startToken.x,
          y: startToken.y,
          targetX: targetLayer.x,
          targetY: targetLayer.y,
          progress: 0,
          speed: 0.02 + Math.random() * 0.02,
          color: [...COLORS.inputToken],
          size: 5
        })
      }
      
      // Create embedding for a token
      const createEmbedding = (tokenIndex: number) => {
        const token = inputTokens[tokenIndex]
        const embedding = {
          tokenIndex: tokenIndex,
          x: token.x + 70,
          y: token.y,
          width: 40,
          height: 5,
          opacity: 0,
          values: Array(16).fill(0).map(() => (Math.random() * 2 - 1) * 0.8) // Random embedding values
        }
        embeddings.push(embedding)
      }
      
      // Create a projection particle
      const createProjectionParticle = () => {
        const highlightedProb = tokenProbabilities.find(p => p.highlighted)
        if (!highlightedProb) return
        
        const targetTokenIndex = Math.min(generationIndex, outputTokens.length - 1)
        const targetToken = outputTokens[targetTokenIndex]
        
        flowParticles.push({
          x: highlightedProb.x,
          y: highlightedProb.y - highlightedProb.height,
          targetX: targetToken.x,
          targetY: targetToken.y,
          progress: 0,
          speed: 0.03,
          color: [...COLORS.highlight],
          size: 6
        })
      }
      
      // Easing function for animations
      const easeInOutCubic = (t: number) => {
        return t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2
      }
      
      // Update flow particles
      const updateFlowParticles = () => {
        for (let i = flowParticles.length - 1; i >= 0; i--) {
          const particle = flowParticles[i]
          
          // Update progress
          if (!isPaused) {
            particle.progress += particle.speed * animationSpeed
          }
          
          // Remove completed particles
          if (particle.progress >= 1) {
            flowParticles.splice(i, 1)
            continue
          }
          
          // Update position with easing
          const easedProgress = easeInOutCubic(particle.progress)
          particle.x = p.lerp(particle.x, particle.targetX, easedProgress)
          particle.y = p.lerp(particle.y, particle.targetY, easedProgress)
          
          // Draw the particle
          p.noStroke()
          p.fill(...particle.color, 200)
          p.circle(particle.x, particle.y, particle.size)
        }
      }
      
      // Update the phase animation
      const updatePhase = () => {
        // Log phase changes only when they occur to avoid console spam
        if (Math.floor(phaseTime * 10) % 10 === 0) {
          console.log(`Phase ${phase} animation at time: ${phaseTime.toFixed(2)}`)
        }
        
        // Check if we should auto-advance to the next phase
        if (!isPaused && phaseTime > 1 && phase < 6) {
          // Signal to the parent component that we should move to the next phase
          console.log(`Auto-advancing from phase ${phase} to ${phase + 1}`)
          
          // Reset animation time for the new phase
          phaseTime = 0
          
          // This will update the prop on the next render
          window.dispatchEvent(new CustomEvent('advancePhase', { 
            detail: { currentPhase: phase, nextPhase: phase + 1 } 
          }))
        }
        
        // Common updates for all phases - ensure basic elements are always visible
        for (let i = 0; i < layers.length; i++) {
          // Always keep layers visible once we reach phase 0
          if (phase >= 0) {
            const targetOpacity = 255
            layers[i].opacity = p.lerp(layers[i].opacity, targetOpacity, 0.05)
          }
        }
        
        // In phases 2+, ensure all input tokens are visible
        if (phase >= 1) {
          for (let i = 0; i < inputTokens.length; i++) {
            if (!inputTokens[i].activated) {
              inputTokens[i].activated = true
            }
            inputTokens[i].opacity = p.lerp(inputTokens[i].opacity, 255, 0.1)
            
            // Create embedding if it doesn't exist
            if (inputTokens[i].opacity > 200 && !embeddings.some(e => e.tokenIndex === i)) {
              createEmbedding(i)
            }
          }
          
          // Make all embeddings visible
          for (let i = 0; i < embeddings.length; i++) {
            embeddings[i].opacity = p.lerp(embeddings[i].opacity, 255, 0.1)
          }
        }
        
        // In phases 3+, ensure all attention patterns are active
        if (phase >= 3) {
          for (let pattern of attentionPatterns) {
            pattern.active = true
            pattern.opacity = p.lerp(pattern.opacity, 255 * pattern.strength, 0.05)
          }
        }
        
        // In phases 4+, show token probabilities
        if (phase >= 4) {
          for (let prob of tokenProbabilities) {
            prob.opacity = p.lerp(prob.opacity, 255, 0.1)
          }
        }
        
        // Now handle phase-specific animations
        switch(phase) {
          case 0: // Initialization
            // Initial architecture fade-in is handled in common updates
            break
            
          case 1: // Tokenization & Embedding
            // Fade in tokens sequentially
            if (phaseTime > tokenIndex * 0.5 && tokenIndex < inputTokens.length) {
              inputTokens[tokenIndex].activated = true
              tokenIndex++
            }
            
            // Rest of token and embedding updates are now in common section
            break
            
          case 2: // Layer processing phase
            // Activate layers sequentially
            const layerToActivate = Math.floor(phaseTime * layers.length * 1.2)
            for (let i = 0; i < layers.length; i++) {
              if (i <= layerToActivate) {
                layers[i].activated = true
                
                // Activate layer components in sequence
                const components = layers[i]
                const layerProgress = (phaseTime * layers.length * 1.2) - i
                
                // Note: replaced "layers[i].components" with direct component access
                // since we're not sure if the structure is exactly the same
                if (layers[i].ffn) {
                  if (layerProgress > 0.75) layers[i].ffn.opacity = Math.min(255, (layerProgress - 0.75) * 4 * 255)
                  if (layerProgress > 0.75) layers[i].ffn.activated = true
                }
                
                if (layers[i].normalization) {
                  if (layerProgress > 0.5) layers[i].normalization.opacity = Math.min(255, (layerProgress - 0.5) * 4 * 255)
                  if (layerProgress > 0.5) layers[i].normalization.activated = true
                }
                
                // Activate heads within this layer
                if (layers[i].attentionHeads) {
                  for (let j = 0; j < layers[i].attentionHeads.length; j++) {
                    const headProgress = layerProgress - 0.1 - (j * 0.05)
                    if (headProgress > 0) {
                      layers[i].attentionHeads[j].opacity = Math.min(255, headProgress * 6 * 255)
                      layers[i].attentionHeads[j].activated = true
                    }
                  }
                }
              }
            }
            
            // Create flow particles for visual effect
            if (p.frameCount % Math.floor(30 / animationSpeed) === 0) {
              createFlowParticle()
            }
            break
            
          case 3: // Attention mechanism
            // Attention pattern updates moved to common section
            break
            
          case 4: // Output probabilities
            // Token probability updates moved to common section
            
            // Show "next token" probability preview on first output token
            outputTokens[0].opacity = Math.min(100 + Math.sin(p.frameCount * 0.1) * 50, 255)
            
            // Pulse effect on highest probability token
            const highlightedProb = tokenProbabilities.find(p => p.highlighted)
            if (highlightedProb && highlightedProb.opacity > 200) {
              // Create occasional flow from highest probability to output token
              if (p.frameCount % Math.floor(40 / animationSpeed) === 0) {
                createProjectionParticle()
              }
            }
            break
            
          case 5: // Token projection
            // Select highest probability token
            const projHighlightedProb = tokenProbabilities.find(p => p.highlighted)
            if (projHighlightedProb) {
              projHighlightedProb.height = p.lerp(projHighlightedProb.height, projHighlightedProb.maxHeight * 1.5, 0.1)
            }
            
            // Add flow particles from probabilities to output
            if (phaseTime > 0.5 && p.frameCount % 20 === 0) {
              createProjectionParticle()
            }
            break
            
          case 6: // Text generation
            // Generate tokens one by one
            if (phaseTime > generationIndex * 1.0 && generationIndex < outputTokens.length) {
              console.log(`Generating token ${generationIndex}`)
              outputTokens[generationIndex].generating = true
              outputTokens[generationIndex].opacity = 100
              generationIndex++
            }
            
            // Update output token states
            for (let i = 0; i < outputTokens.length; i++) {
              const token = outputTokens[i]
              if (token.generating) {
                token.opacity = p.lerp(token.opacity, 255, 0.1)
                if (token.opacity > 230) {
                  token.activated = true
                  token.generating = false
                }
              }
            }
            
            // Debug token generation state
            if (Math.floor(phaseTime * 10) % 10 === 0) {
              console.log("Generation state:", {
                phaseTime,
                generationIndex,
                outputTokensLength: outputTokens.length,
                generatingTokens: outputTokens.filter(t => t.generating).length,
                activatedTokens: outputTokens.filter(t => t.activated).length
              })
            }
            break
        }
      }
      
      // Drawing functions
      const drawInputTokens = () => {
        for (let token of inputTokens) {
          if (token.opacity <= 0) continue
          
          // Token background
          p.noStroke()
          p.fill(...COLORS.inputToken, token.opacity * 0.8)
          p.rect(token.x - 80, token.y - 15, 160, 30, 15)
          
          // Token text
          p.fill(...COLORS.text, token.opacity)
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(14)
          p.text(token.text, token.x, token.y)
          
          // Token ID if in advanced mode
          if (advancedMode && token.opacity > 200) {
            p.fill(...COLORS.dimText, token.opacity * 0.7)
            p.textAlign(p.CENTER, p.BOTTOM)
            p.textSize(10)
            p.text(`ID: ${10000 + inputTokens.indexOf(token)}`, token.x, token.y - 16)
          }
          
          // Activation indicator
          if (token.activated && p.frameCount % 40 < 20) {
            p.noFill()
            p.stroke(...COLORS.inputToken, token.opacity * 0.7)
            p.strokeWeight(2)
            p.rect(token.x - 80, token.y - 15, 160, 30, 15)
          }
          
          // Draw positional encoding indicator if in phase 1+
          if (phase >= 1 && token.opacity > 200) {
            p.noStroke()
            p.fill(...COLORS.positionalEncoding, token.opacity * 0.7)
            p.rect(token.x - 75, token.y + 16, 25, 4, 2)
            
            // Label if in advanced mode
            if (advancedMode) {
              p.fill(...COLORS.positionalEncoding, token.opacity * 0.9)
              p.textAlign(p.LEFT, p.TOP)
              p.textSize(9)
              p.text("pos", token.x - 75, token.y + 22)
            }
          }
        }
      }
      
      const drawEmbeddings = () => {
        for (let embedding of embeddings) {
          if (embedding.opacity <= 0) continue
          
          // Background for embedding
          p.noStroke()
          p.fill(60, 100, 180, embedding.opacity * 0.6)
          p.rect(embedding.x - embedding.width/2, embedding.y - embedding.height/2, 
               embedding.width, embedding.height * 6, 5)
          
          // Draw embedding values as a small bar chart
          for (let i = 0; i < Math.min(embedding.values.length, 16); i++) {
            const value = embedding.values[i]
            const barHeight = Math.abs(value) * 12
            const barY = embedding.y + (i % 8) * 10 - 30
            const barX = embedding.x - 30 + Math.floor(i / 8) * 30
            
            // Bar
            p.noStroke()
            p.fill(value > 0 ? [100, 200, 255, embedding.opacity] : [255, 100, 100, embedding.opacity])
            p.rect(barX, barY, 20, barHeight, 2)
          }
          
          // Label
          p.fill(...COLORS.text, embedding.opacity)
          p.textAlign(p.CENTER, p.BOTTOM)
          p.textSize(11)
          p.text("Embedding", embedding.x, embedding.y - 35)
          
          // Technical details if in advanced mode
          if (advancedMode) {
            p.fill(...COLORS.dimText, embedding.opacity * 0.8)
            p.textAlign(p.CENTER, p.TOP)
            p.textSize(9)
            p.text(`d=${hiddenDim}`, embedding.x, embedding.y + 35)
          }
        }
      }
      
      const drawLayers = () => {
        for (let layer of layers) {
          if (layer.opacity <= 0) continue
          
          // Layer background
          p.noStroke()
          p.fill(...COLORS.layerBase, layer.opacity * 0.7)
          p.rect(layer.x - layer.width/2, layer.y - layer.height/2, layer.width, layer.height, 10)
          
          // Layer border
          p.noFill()
          p.stroke(...COLORS.layerAccent, layer.opacity * 0.8)
          p.strokeWeight(2)
          p.rect(layer.x - layer.width/2, layer.y - layer.height/2, layer.width, layer.height, 10)
          
          // Layer label
          p.noStroke()
          p.fill(...COLORS.text, layer.opacity)
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(14)
          p.text(`Layer ${layer.index + 1}`, layer.x, layer.y)
          
          // Show total layer count for the first layer
          if (layer.index === 0 && advancedMode) {
            p.fill(...COLORS.dimText, layer.opacity * 0.8)
            p.textAlign(p.LEFT, p.TOP)
            p.textSize(10)
            p.text(`${numLayers} layers total`, layer.x - layer.width/2, layer.y - layer.height/2 - 18)
          }
          
          // Draw attention heads
          for (let head of layer.attentionHeads) {
            if (head.opacity <= 0) continue
            
            // Head circle
            p.noStroke()
            p.fill(...COLORS.attentionHead, head.opacity * 0.7)
            p.circle(head.x, head.y, head.radius * 2)
            
            // Head border if activated
            if (head.activated) {
              p.noFill()
              p.stroke(...COLORS.attentionHead, head.opacity)
              p.strokeWeight(2)
              p.circle(head.x, head.y, head.radius * 2)
            }
            
            // Head label if in advanced mode
            if (advancedMode && head.opacity > 100) {
              p.noStroke()
              p.fill(...COLORS.text, head.opacity * 0.9)
              p.textAlign(p.CENTER, p.CENTER)
              p.textSize(8)
              p.text(`H${head.index + 1}`, head.x, head.y)
            }
          }
          
          // Draw FFN if activated
          if (layer.ffn.activated) {
            const ffnWidth = 80
            const ffnHeight = 20
            const ffnX = layer.x
            const ffnY = layer.y + layer.height/2 + 30
            
            // FFN background
            p.noStroke()
            p.fill(...COLORS.ffn, layer.ffn.opacity * 0.7)
            p.rect(ffnX - ffnWidth/2, ffnY - ffnHeight/2, ffnWidth, ffnHeight, 6)
            
            // FFN label
            p.fill(...COLORS.text, layer.ffn.opacity)
            p.textAlign(p.CENTER, p.CENTER)
            p.textSize(10)
            p.text("FFN", ffnX, ffnY)
            
            // FFN details if in advanced mode
            if (advancedMode) {
              p.fill(...COLORS.dimText, layer.ffn.opacity * 0.8)
              p.textAlign(p.LEFT, p.BOTTOM)
              p.textSize(8)
              p.text(`dim: ${ffnDim}`, ffnX - ffnWidth/2 + 5, ffnY - ffnHeight/2 - 2)
            }
          }
          
          // Draw normalization if activated
          if (layer.normalization.activated) {
            const normWidth = 60
            const normHeight = 6
            const normX = layer.x
            const normY1 = layer.y - layer.height/2 - 15
            const normY2 = layer.y + layer.height/2 + 15
            
            // Pre-norm
            p.noStroke()
            p.fill(...COLORS.normalization, layer.normalization.opacity * 0.7)
            p.rect(normX - normWidth/2, normY1 - normHeight/2, normWidth, normHeight, 3)
            
            // Post-norm
            p.rect(normX - normWidth/2, normY2 - normHeight/2, normWidth, normHeight, 3)
            
            // Labels if in advanced mode
            if (advancedMode) {
              p.fill(...COLORS.dimText, layer.normalization.opacity * 0.8)
              p.textAlign(p.CENTER, p.BOTTOM)
              p.textSize(8)
              p.text("LN", normX, normY1 - normHeight/2 - 2)
              p.text("LN", normX, normY2 - normHeight/2 - 2)
            }
          }
        }
      }
      
      const drawAttentionPatterns = () => {
        // Debug log for attention patterns
        if (phase === 3 && Math.floor(phaseTime * 10) % 10 === 0) {
          console.log("Drawing attention patterns:", {
            phase,
            attentionPatternsCount: attentionPatterns.length,
            layersLength: layers.length,
            hasActivatedHeads: layers.some(layer => layer.attentionHeads?.some((h: any) => h.activated))
          })
        }
        
        // Modified: Show attention patterns in phase 3 and beyond
        if (phase < 3) return
        
        for (let pattern of attentionPatterns) {
          if (!pattern.active || pattern.opacity < 10) continue
          
          const fromToken = inputTokens[pattern.fromToken]
          const toToken = inputTokens[pattern.toToken]
          
          if (fromToken && toToken) {
            // Only draw lines between visible tokens
            if (fromToken.opacity > 100 && toToken.opacity > 100) {
              p.stroke(...COLORS.attentionLine, pattern.opacity * pattern.strength)
              p.strokeWeight(1 + pattern.strength * 2)
              p.line(fromToken.x, fromToken.y, toToken.x, toToken.y)
              
              // Draw arrow from source to target for strong connections
              if (pattern.strength > 0.7) {
                const dir = p.createVector(toToken.x - fromToken.x, toToken.y - fromToken.y)
                dir.normalize()
                const arrowSize = 8
                
                p.push()
                p.translate(p.lerp(fromToken.x, toToken.x, 0.6), p.lerp(fromToken.y, toToken.y, 0.6))
                p.rotate(Math.atan2(dir.y, dir.x))
                p.fill(...COLORS.attentionLine, pattern.opacity * pattern.strength)
                p.noStroke()
                p.triangle(0, 0, -arrowSize, arrowSize/2, -arrowSize, -arrowSize/2)
                p.pop()
              }
            }
          }
        }
      }
      
      const drawOutputTokens = () => {
        // Debug info for output tokens
        if ((phase === 4 || phase === 6) && Math.floor(phaseTime * 10) % 10 === 0) {
          console.log("Drawing output tokens:", {
            phase,
            outputTokensCount: outputTokens.length,
            visibleTokens: outputTokens.filter(t => t.opacity > 0).length,
            generationIndex
          })
        }
        
        // No condition here - output tokens should be drawn in all phases where they have opacity
        for (let token of outputTokens) {
          if (token.opacity <= 0) continue
          
          // Token background
          p.noStroke()
          p.fill(...COLORS.outputToken, token.opacity * 0.8)
          p.rect(token.x - 100, token.y - 15, 200, 30, 15)
          
          // Token text
          p.fill(...COLORS.text, token.opacity)
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(14)
          p.text(token.text, token.x, token.y)
          
          // Generating animation
          if (token.generating && p.frameCount % 40 < 20) {
            p.noFill()
            p.stroke(...COLORS.outputAccent, token.opacity * 0.9)
            p.strokeWeight(3)
            p.rect(token.x - 100, token.y - 15, 200, 30, 15)
          }
        }
      }
      
      const drawTokenProbabilities = () => {
        // Debug for token probabilities
        if (phase === 4 && Math.floor(phaseTime * 10) % 10 === 0) {
          console.log("Drawing token probabilities:", {
            phase,
            probCount: tokenProbabilities.length,
            visibleProbs: tokenProbabilities.filter(p => p.opacity > 0).length
          })
        }
        
        // Modified: Show token probabilities in phase 4 and beyond
        if (phase < 4) return
        
        // Draw header
        p.noStroke()
        p.fill(...COLORS.text, 200)
        p.textAlign(p.CENTER, p.BOTTOM)
        p.textSize(14)
        p.text("Token Probabilities", OUTPUT_X, FOOTER_Y - 110)
        
        // Draw vocabulary size if in advanced mode
        if (advancedMode) {
          p.fill(...COLORS.dimText, 150)
          p.textSize(10)
          p.text(`Vocabulary size: ${vocabSize}`, OUTPUT_X, FOOTER_Y - 90)
        }
        
        // Draw probability bars
        for (let prob of tokenProbabilities) {
          if (prob.opacity <= 0) continue
          
          // Bar background
          p.noStroke()
          const color = prob.highlighted ? COLORS.highlight : COLORS.outputToken
          p.fill(...color, prob.opacity * 0.8)
          p.rect(prob.x - prob.width/2, prob.y - prob.height, prob.width, prob.height, 2)
          
          // Bar border for highlighted tokens
          if (prob.highlighted) {
            p.noFill()
            p.stroke(...COLORS.highlight, prob.opacity)
            p.strokeWeight(2)
            p.rect(prob.x - prob.width/2, prob.y - prob.height, prob.width, prob.height, 2)
            
            // Token text label
            if (prob.text && prob.opacity > 100) {
              p.noStroke()
              p.fill(...COLORS.text, prob.opacity)
              p.textAlign(p.CENTER, p.BOTTOM)
              p.textSize(12)
              p.text(prob.text, prob.x, prob.y - prob.height - 5)
            }
          }
        }
      }
      
      const drawPhaseIndicator = () => {
        // Draw title
        p.noStroke()
        p.fill(...COLORS.text, 255)
        p.textAlign(p.CENTER, p.TOP)
        p.textSize(16)
        p.text("LLM Architecture Visualization", LAYERS_X, 20)
        
        // Draw phase progress bar
        const barWidth = 300
        const barHeight = 6
        const barX = LAYERS_X - barWidth/2
        const barY = 50
        
        // Background
        p.noStroke()
        p.fill(...COLORS.panel, 150)
        p.rect(barX, barY, barWidth, barHeight, 3)
        
        // Progress
        const progress = (phase / 6) * barWidth
        p.fill(...COLORS.layerAccent, 200)
        p.rect(barX, barY, progress, barHeight, 3)
        
        // Phase markers
        for (let i = 0; i <= 6; i++) {
          const markerX = barX + (i / 6) * barWidth
          const isActive = i <= phase
          
          p.noStroke()
          p.fill(...(isActive ? COLORS.layerAccent : COLORS.dimText), 200)
          p.circle(markerX, barY + barHeight/2, 8)
        }
      }
      
      // Window resize handler
      p.windowResized = () => {
        if (containerRef.current) {
          console.log("Window resize detected, new container dimensions:", {
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight
          })
          p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight)
          resetLayout()
        }
      }
    }
    
    try {
      // Create the p5 instance
      console.log("Creating p5 instance with window.p5:", typeof window.p5)
      p5InstanceRef.current = new window.p5(sketch, containerRef.current)
      console.log("p5 instance created successfully")
    } catch (error: any) {
      console.error("Error creating p5 instance:", error)
      setLoadError(`Error creating p5 instance: ${error.message}`)
    }
    
    // Cleanup function
    return () => {
      if (p5InstanceRef.current) {
        console.log("Removing p5 instance")
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
  }, [p5Loaded, phase, isPaused, animationSpeed, showAttentionMaps, advancedMode])
  
  return (
    <div 
      ref={containerRef}
      id="p5-container" 
      className="w-full h-full bg-[#151a25]"
      style={{ minHeight: '500px' }} // Ensure the container has a minimum height
    >
      {!p5Loaded && !loadError && (
        <div className="flex items-center justify-center w-full h-full text-white">
          Loading p5.js visualization...
        </div>
      )}
      
      {loadError && (
        <div className="flex items-center justify-center w-full h-full text-red-400">
          {loadError}
        </div>
      )}
    </div>
  )
}

export default P5Wrapper 
# LLM Architecture Visualization

An educational visualization of Large Language Model architecture using Next.js 14, TypeScript, and p5.js.

## Project Structure

The project has been refactored from a single HTML file into a modular Next.js application:

- `app/` - Next.js App Router directory
  - `components/` - React components
    - `LLMVisualization.tsx` - Main visualization component
    - `InfoPanel.tsx` - Side panel with phase information
    - `ControlPanel.tsx` - Controls for animation
    - `AttentionVisualization.tsx` - Attention visualization component
    - `LayerDetailPanel.tsx` - Detail panel for layers
    - `Tooltip.tsx` - Tooltip for hover information
    - `P5Wrapper.tsx` - Wrapper for p5.js integration
  - `globals.css` - Global styles
  - `layout.tsx` - Root layout
  - `page.tsx` - Homepage

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Interactive visualization of LLM architecture
- Multi-phase walkthrough of how LLMs process text
- Visualization of attention mechanisms
- Controls for animation speed and playback
- Detailed information panels

## Next Steps

The refactoring has separated the components, but the p5.js visualization logic needs to be fully integrated into the P5Wrapper component.
# Automata Compiler Visualizer

The Automata Compiler Visualizer is a powerful, interactive web application designed for visualizing and simulating various computational models, including Deterministic Finite Automata (DFA), Pushdown Automata (PDA), and Context-Free Grammars (CFG).

## Features

- **Interactive DFA Simulation**: Visualize state transitions as you step through input strings.
- **PDA Visualizer & Simulator**: Watch the stack grow and shrink in real-time with animated push/pop operations.
- **CFG Engine**: Parse and validate strings against complex context-free grammar rules.
- **Dynamic Graph Visualizations**: High-quality SVG graphs powered by D3.js with force-directed layouts.
- **Step-by-Step Execution**: Control the flow of simulation to better understand computational paths.
- **Modern UI/UX**: Built with a sleek, dark-themed interface using Tailwind CSS and smooth animations via Framer Motion.

## Folder Structure

```text
/
├── public/                 # Static assets
├── src/
│   ├── cfg/                # Context-Free Grammar logic and UI (CURRENTLY NOT PUSHED)
│   │   ├── CFGSimulatorUI.tsx
│   │   ├── cfgData.ts
│   │   └── cfgEngine.ts
│   ├── dfa/                # Deterministic Finite Automata logic and UI
│   │   ├── DFASimulatorUI.tsx
│   │   ├── dfaData.ts
│   │   └── dfaSimulator.ts
│   ├── pda/                # Pushdown Automata logic and UI (CURRENTLY NOT PUSHED)
│   │   ├── PDASimulatorUI.tsx
│   │   ├── pdaData.ts
│   │   └── pdaSimulator.ts
│   ├── ui/                 # Shared UI components
│   ├── visualization/      # D3.js graph engine
│   │   ├── D3Graph.tsx
│   │   └── GraphView.tsx
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   ├── types.ts            # Project-wide TypeScript interfaces
│   └── index.css           # Global styles and Tailwind directives
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## Technologies Used

- **React 18**: Frontend library.
- **Vite**: Build tool and dev server.
- **Tailwind CSS**: Utility-first styling.
- **D3.js**: Data-driven document manipulation for graph visualizations.
- **Motion (framer-motion)**: Animation library.
- **Lucide React**: Icon set.
- **TypeScript**: Static typing for robust code.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/automata-grammar-lab.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` (or the port indicated in your terminal).

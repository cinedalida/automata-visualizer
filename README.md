# Automata Compiler Visualizer

The **Automata Compiler Visualizer** is a powerful, interactive, and premium web application designed to simulate and visualize key computational models: **Deterministic Finite Automata (DFA)**, **Pushdown Automata (PDA)**, and **Context-Free Grammars (CFG)**. It bridges formal language theory with highly polished interactive visuals using a Minecraft-inspired retro-modern aesthetic, combined with a curated Ocean Blue theme.

---

## Core Features

The visualizer implements a wide array of premium interactive and diagnostic features that transform theoretical automata exercises into engaging experiments:

* **Compiler Selector**: Users can navigate between the DFA Visualizer, PDA Simulator, and CFG Compiler using the top navigation bar to validate strings against different formal models. While these compilers were built from scratch closely following formal definitions, some visual compromises were made to simplify the user experience.
* **Operational Trace / Transition Table**: Provides real-time, step-by-step information detailing the operations of the selected automaton. For instance, in the DFA Visualizer, the Transition Table shows each character being read and its corresponding processing status. If the compiler fails, a meaningful error message is returned detailing the cause of failure.
* **Compiler Result**: Displays a straightforward message derived from the processing trace, confirming whether the input string is "ACCEPTED," "REJECTED," or currently "IDLE/PROCESSING" by the automaton.
* **State Visualization** - Displays a dynamic, node-based graph of the automaton, highlighting the active state and the sequence of transitions as each character in the input string is processed. The visualization also includes interactive controls for zooming in, zooming out, and enabling full-screen mode to provide a clearer and more detailed view of the structure. 
* **Animated Stack Memory (PDA Simulator Only)**: Visually represents the Last-In-First-Out (LIFO) stack memory used by the Pushdown Automaton. It displays how each character is pushed to or popped from the stack as the input is read, identifying the state responsible for the action and emphasizing the current top of the stack.
* **Derivation Workflow & Grammar (CFG Compiler Only)**: Displays the defined production rules alongside a sequential derivation workflow, illustrating how the source string is expanded from the start variable to terminal symbols.
* **Playback Controls (DFA and PDA)** - Control the pace of computation with full-featured transport keys: Play, Step Forward,  and Reset.
* **Valid and Invalid Testbeds** - Comes pre-populated with complex edge cases and standard validation string suites, facilitating instant verification of correct and incorrect scenarios.
* **Multiline/Batch Processing of Strings** - Supports both single-string and multiline batch processing modes through a toggleable interface. Users can validate up to five input strings simultaneously, with each string processed independently and its corresponding result displayed.
* **User Manual** - Provides an overview of automata theory, the core functionalities of the compiler suite, and a step-by-step tutorial on how to use each module. It also includes explanations of supported formal models, interface controls, input formatting rules, and sample test cases to guide users throughout the simulation process.

---

## Glossary of Terms & Definitions

To enhance the visualizer's academic value, here is a quick reference glossary covering the core concepts of automata theory and compiler construction:

* **Deterministic Finite Automata (DFA)**: A finite state machine where for each state and input symbol, there is exactly one transition to a next state. It represents regular languages ($L \in \text{Regular}$).
* **Pushdown Automata (PDA)**: An extension of finite automata that includes a single stack memory ($\Gamma$). Transitions depend on the current state, input symbol, and the top stack symbol. It represents context-free languages ($L \in \text{CFL}$).
* **Context-Free Grammar (CFG)**: A formal grammar system consisting of a set of recursive production rules ($A \rightarrow \alpha$) used to generate strings. It maps variables and terminal symbols to describe syntax structures.
* **Alphabet ($\Sigma$)**: A finite set of symbols (e.g., $\{0, 1\}$ or $\{a, b\}$) from which valid strings in a formal language can be constructed.
* **Transition ($\delta$)**: A mathematical mapping or rule that specifies the state change of a machine based on its current configuration and active input token.
* **Epsilon Transition ($\epsilon$)**: A transition that takes place spontaneously without consuming any character from the input tape, essential for PDA non-deterministic paths and closure states.
* **Sentential Form**: A sequence of variables and terminals representing an intermediate string derived during the expansion steps of a grammar before reaching the final string.
* **Leftmost Derivation**: A parsing method where the leftmost non-terminal variable in a sentential form is consistently chosen for replacement first.
* **Breadth-First Search (BFS) Path Solver**: An algorithmic traversal that evaluates all possible branches layer by layer, used to resolve non-deterministic paths (PDA transitions) and sentential expansions (CFG derivations) effectively.
* **Trap State / Dead End**: A state or sentential path from which a valid accepting state cannot be reached.
* **Matched Length**: The maximum character count from the start of an input string that matches a valid path or sentential form before a transition or variable expansion fails.

---

## System Architecture & Components

The application is structured as a **Single Page Application (SPA)** using a clean separation of concerns between core simulation/parsing engines (the "logic backend") and interactive React interfaces (the "frontend visualizers").

### 1. The Core Simulation Engines (Logic Layer)

* **DFA Simulator (`src/dfa/dfaSimulator.ts`)**:
  * Implements deterministic finite state transitions.
  * Validates input strings against the designated alphabet.
  * Maintains a step-by-step history trace (`getTraceString`) for real-time play/pause and stepping.
* **PDA Simulator (`src/pda/pdaSimulator.ts`)**:
  * Models non-deterministic pushdown transition behavior.
  * Uses a high-performance **Breadth-First Search (BFS)** solver (up to 50,000 max iterations) to compute valid transition paths.
  * Enables dynamic stack push/pop actions, epsilon ($\epsilon$) transitions, and visual stack frame rendering.
* **CFG Compiler Engine (`src/cfg/cfgEngine.ts`)**:
  * Implements a custom **BFS Leftmost Derivation** parsing algorithm.
  * Employs **five stages of pruning** to achieve blazing-fast parsing and prevent state-space explosion:
    1. **Terminal Prefix Matching**: Aborts paths where the prefix of derived terminals does not match the target string prefix.
    2. **Terminal Count Guard**: Prunes sentential forms whose terminal counts already exceed the target string length.
    3. **Length Sanity Bounds**: Restricts overall sentential form growth to a proportional length ceiling.
    4. **Bad Expansion Rejection**: Instantly halts invalid variable expansions after production rules are applied.
    5. **All-Terminal Dead Ends**: Discards full-terminal sentential forms that fail to match the input.
  * Calculates a detailed `matchedLength` to provide professional, compiler-grade diagnostics (unexpected suffixes, syntax highlight points, and diagnostic logs) upon string rejection.

### 2. D3.js Graphic Visualization Engine (`src/visualization/D3Graph.tsx`)

* Renders interactive, force-directed SVG graphs representing automata transitions.
* Accents active states, starting entry points, self-loop offsets, and path transitions dynamically.
* Provides robust layouts, avoiding node overlaps and keeping self-transitions perfectly curved and readable.

### 3. The Interactive UI Layer (Frontend)

* **DFASimulatorUI.tsx**: Displays active state-machine transitions step-by-step alongside live examples and regular expressions.
* **PDASimulatorUI.tsx**: Visually illustrates the pushdown stack memory as elements push and pop, while tracing operational execution.
* **CFGSimulatorUI.tsx**: Displays the production rules of the grammar, traces derivation workflows step-by-step, and delivers a compiler console with syntax highlights for rejected tokens.
* **Controller.tsx**: Houses the application header, custom font bindings, and the tab navigation system.

---

## Folder Structure

```text
automata-visualizer/
├── public/                 # Static assets and favicons
├── src/
│   ├── cfg/                # Context-Free Grammar component folder
│   │   ├── CFGSimulatorUI.tsx  # CFG Interactive IDE and diagnostics console
│   │   ├── cfgData.ts          # Predetermined grammar datasets
│   │   └── cfgEngine.ts        # Highly-optimized CFG BFS derivation engine
│   ├── dfa/                # Deterministic Finite Automata component folder
│   │   ├── DFASimulatorUI.tsx  # Step-by-step DFA animator UI
│   │   ├── dfaData.ts          # Transition tables for DFA expressions
│   │   └── dfaSimulator.ts     # DFA state resolution simulator
│   ├── pda/                # Pushdown Automata component folder
│   │   ├── PDASimulatorUI.tsx  # Interactive PDA trace and live stack visualizer
│   │   ├── pdaData.ts          # PDA state machine definitions
│   │   └── pdaSimulator.ts     # BFS-based PDA stack path resolver
│   ├── ui/                 # Shared UI elements
│   │   └── Controller.tsx      # Main wrapper & responsive navigation controller
│   ├── visualization/      # Graph visualization engine
│   │   ├── D3Graph.tsx         # D3.js force-directed graph renderer
│   │   └── GraphView.tsx       # Graph viewport controller
│   ├── fonts/              # Custom assets (MinecraftFont etc.)
│   ├── images/             # Wallpaper and background graphics
│   ├── App.tsx             # Entry-point wrapper
│   ├── constants.ts        # Global regular expressions and constants
│   ├── index.css           # Global stylesheet and Tailwind CSS v4 layers
│   ├── main.tsx            # DOM mounting and React rendering bootstrap
│   ├── types.ts            # TypeScript definitions (DFA, PDA, CFG, States)
│   └── vite-env.d.ts       # Global build environmental typings
├── package.json            # Script definitions and project dependencies
├── tsconfig.json           # Compiler rules for TypeScript
└── vite.config.ts          # Vite configuration using Tailwind CSS v4 plugins
```

---

## Built With

* **React 19**: Responsive view rendering.
* **TypeScript 5.8**: Enterprise-grade static checking.
* **Vite 6**: Ultrafast bundling and Hot Module Replacement (HMR).
* **Tailwind CSS v4**: Utility-first styling with `@tailwindcss/vite` integration.
* **D3.js v7**: SVG transition vector graph generator.
* **Framer Motion**: Smooth micro-animations and transition state-swaps.
* **Lucide React**: Clean developer iconography.

---

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cinedalida/automata-visualizer.git
   ```
2. **Navigate into the workspace**:
   ```bash
   cd automata-visualizer
   ```
3. **Install the dependencies**:
   ```bash
   npm install
   ```

### Development Scripts

* **Launch local server**:

  ```bash
  npm run dev
  ```

  Open `http://localhost:3000` in your web browser.
* **Build production package**:

  ```bash
  npm run build
  ```
* **Preview production build**:

  ```bash
  npm run preview
  ```
* **TypeScript compile-time dry-run check**:

  ```bash
  npm run lint
  ```

---

## Final Checking & Verification Report

A series of thorough automated checks were performed to guarantee the visual, structural, and technical integrity of both the frontend components and backend logic engines:

| Parameter Checked          | Tool Used            |        Result Status        | Diagnostic Notes                                                                                                                    |
| :------------------------- | :------------------- | :-------------------------: | :---------------------------------------------------------------------------------------------------------------------------------- |
| **Static Types**     | `npx tsc --noEmit` |  **PASS (0 errors)**  | Verified full type coverage across engines (`cfgEngine`, `pdaSimulator`, `dfaSimulator`) and visualizers.                     |
| **Asset Imports**    | Vite Bundler         | **PASS (0 warnings)** | Cleaned up missing tile image assets. Optimized CSS layer rules. All assets now bundle without resolving exceptions.                |
| **Production Build** | `npm run build`    |  **PASS (Success)**  | Successfully transformed 2651 modules, compiled and packaged into optimized static assets in under 5 seconds.                       |
| **Algorithms**       | BFS & Pruning        |  **PASS (Verified)**  | High-efficiency pruning algorithms keep CFG derivation paths and PDA search spaces responsive under extreme constraints.            |
| **UI Aesthetics**    | Local QA             | **PASS (Excellent)** | Smooth animations, organic Comfortaa and Minecraft typography, pixel-rendering filters, and Ocean Blue highlight bars work in sync. |

---

## Authors & Project Credits

This project was built for **Subject: AUTOMATA THEORY AND FORMAL LANGUAGES (S-CSPC327)**.

* **Francine Dalida** — Core Simulators & Engine Logic
* **Criselda Perdito** — Responsive Frontend & UI Animations
* **Kyle Panganiban** — Responsive Frontend & UI Animations
* **Rona Dalistan** — Technical Documentation & QA Testing

---

## Pictures

### Website Demo

![Website Demo](src/images/website-demo.png)

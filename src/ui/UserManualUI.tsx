import React, { useState } from "react";
import { BookOpen, HelpCircle, Activity, Layers, Terminal, CornerDownRight, Cpu } from "lucide-react";

type ManualSection = "THEORY" | "FEATURES" | "DFA" | "PDA" | "CFG";

export default function UserManualUI() {
  const [activeSection, setActiveSection] = useState<ManualSection>("THEORY");

  const sections: { id: ManualSection; label: string; icon: any; color: string; hoverColor: string }[] = [
    { id: "THEORY", label: "Core Theory & Definitions", icon: BookOpen, color: "text-[#0077B6]", hoverColor: "hover:bg-blue-50" },
    { id: "FEATURES", label: "Compiler Core Features", icon: Cpu, color: "text-amber-500", hoverColor: "hover:bg-amber-50" },
    { id: "DFA", label: "DFA Visualizer Guide", icon: Activity, color: "text-sky-500", hoverColor: "hover:bg-sky-50" },
    { id: "PDA", label: "PDA Simulator Guide", icon: Layers, color: "text-emerald-500", hoverColor: "hover:bg-emerald-50" },
    { id: "CFG", label: "CFG Compiler Guide", icon: Terminal, color: "text-purple-500", hoverColor: "hover:bg-purple-50" },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 text-slate-800 p-6 md:p-10 font-sans shadow-xl relative rounded-none">
      {/* Premium Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0077B6] via-sky-400 to-purple-600 rounded-none"></div>

      {/* Manual Intro Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-8 mb-8 mt-2">
        <div className="flex items-center gap-5">
          <div className="bg-[#0077B6]/5 border border-[#0077B6]/20 p-4 rounded-none flex items-center justify-center shadow-sm">
            <HelpCircle className="w-9 h-9 text-[#0077B6]" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-minecraft tracking-normal text-slate-900 uppercase">
              Automata User Manual
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium tracking-wide uppercase mt-1">
              Your comprehensive guide to formal languages, machine simulation, and grammar derivations
            </p>
          </div>
        </div>
        <div className="text-[11px] bg-slate-50 border border-slate-200 px-4 py-2 font-mono text-slate-600 rounded-none font-bold tracking-wider shadow-sm">
          Reference: <a href="https://www.geeksforgeeks.org/" target="_blank" rel="noopener noreferrer" className="underline text-[#0077B6] hover:text-[#005f9e] transition-colors">GeeksforGeeks</a>
        </div>
      </div>

      {/* Grid Layout: Left Sidebar Buttons, Right Content Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section Navigation Buttons (Sleek Modern Sharp Cards) */}
        <div className="lg:col-span-3 flex flex-col gap-3.5">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`
                  w-full px-6 py-4.5 flex items-center gap-4 transition-all duration-300 text-left font-minecraft tracking-wider text-xs md:text-sm rounded-none border-2
                  ${isActive
                    ? "border-[#0077B6] bg-blue-50/50 text-[#0077B6] font-bold shadow-md shadow-[#0077B6]/5 translate-x-1"
                    : `border-slate-100 bg-slate-50/30 text-slate-600 ${sec.hoverColor} hover:text-slate-900 hover:border-slate-200 hover:shadow-sm`
                  }
                `}
              >
                <Icon className={`w-5.5 h-5.5 ${sec.color}`} />
                <span className="font-bold">{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Pane (Clean light backdrop with sharp borders) */}
        <div className="lg:col-span-9 bg-slate-50/40 border border-slate-200/60 p-6 md:p-10 rounded-none min-h-[580px] flex flex-col relative overflow-y-auto max-h-[720px] shadow-inner">
          
          {/* ============================================================ */}
          {/* SECTION 1: THEORY DEFINITIONS */}
          {/* ============================================================ */}
          {activeSection === "THEORY" && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-2xl md:text-3xl font-minecraft text-slate-900 border-b border-slate-100 pb-3 mb-6 uppercase flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-[#0077B6]" /> Core Concepts & Formal Definitions
              </h3>
              
              <div className="space-y-8 text-sm md:text-base text-slate-600 leading-relaxed font-sans">
                {/* AUTOMATA */}
                <div className="bg-white p-6 md:p-8 border border-slate-200/80 rounded-none shadow-sm">
                  <h4 className="text-base md:text-lg font-minecraft text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-[#0077B6] rounded-none"></span> Automata Theory
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    Ref: GeeksforGeeks Standard Literature
                  </p>
                  <p className="text-[14px] md:text-[16px]">
                    <strong>Automata Theory</strong> is a branch of computer science that deals with designing abstract self-propelled computing devices (automata) that follow a predetermined sequence of operations automatically. These computational machines serve as logical abstractions to classify languages, build compilers/parsers, and analyze the mathematical capabilities and limits of computation.
                  </p>
                </div>

                {/* DFA */}
                <div className="bg-white p-6 md:p-8 border border-slate-200/80 rounded-none shadow-sm">
                  <h4 className="text-base md:text-lg font-minecraft text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-sky-400 rounded-none"></span> Deterministic Finite Automaton (DFA)
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    Ref: GeeksforGeeks DFA Representation
                  </p>
                  <p className="text-[14px] md:text-[16px] mb-4">
                    A <strong>Deterministic Finite Automaton (DFA)</strong> consists of states and transitions. For each input symbol, there is exactly one designated state to which the machine transitions. Because its execution pathway is unique and completely predictable, it is termed <strong>Deterministic</strong>.
                  </p>
                  <div className="bg-slate-50 p-5 md:p-6 border border-slate-200 font-mono text-xs md:text-sm text-slate-700 rounded-none space-y-2.5">
                    <div className="text-[#0077B6] font-bold text-sm md:text-base border-b border-slate-200 pb-1.5 mb-2">Mathematical Definition (5-Tuple): M = (Q, Σ, δ, q₀, F)</div>
                    <div>• <strong>Q</strong>: Finite set of states (e.g., {"{q0, q1, q2}"})</div>
                    <div>• <strong>Σ</strong>: Finite set of input alphabet symbols (e.g., {"{0, 1}"} or {"{a, b}"})</div>
                    <div>• <strong>δ</strong>: Transition mapping function (δ: Q × Σ → Q)</div>
                    <div>• <strong>q₀</strong>: Start state where computation begins (q₀ ∈ Q)</div>
                    <div>• <strong>F</strong>: Set of accepting/final states (F ⊆ Q)</div>
                  </div>
                </div>

                {/* PDA */}
                <div className="bg-white p-6 md:p-8 border border-slate-200/80 rounded-none shadow-sm">
                  <h4 className="text-base md:text-lg font-minecraft text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-none"></span> Pushdown Automaton (PDA)
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    Ref: GeeksforGeeks PDA Mechanics
                  </p>
                  <p className="text-[14px] md:text-[16px] mb-4">
                    A <strong>Pushdown Automaton (PDA)</strong> extends the capabilities of a DFA by adding an auxiliary <strong>Stack memory</strong> of infinite capacity. This allows the machine to recognize context-free languages (like nested brackets or balanced strings) that require memory of past inputs.
                  </p>
                  <div className="bg-slate-50 p-5 md:p-6 border border-slate-200 font-mono text-xs md:text-sm text-slate-700 rounded-none space-y-2.5">
                    <div className="text-emerald-600 font-bold text-sm md:text-base border-b border-slate-200 pb-1.5 mb-2">Mathematical Definition (7-Tuple): M = (Q, Σ, Γ, δ, q₀, Z₀, F)</div>
                    <div>• <strong>Q, Σ, q₀, F</strong>: States, alphabet, start state, and accept states (as in DFA)</div>
                    <div>• <strong>Γ</strong>: Stack alphabet containing symbols that can be pushed to the stack</div>
                    <div>• <strong>Z₀</strong>: Initial stack marker symbol placed on stack at startup (Z₀ ∈ Γ)</div>
                    <div>• <strong>δ</strong>: Transition relation mapping (δ: Q × (Σ ∪ {"{ε}"}) × Γ → P(Q × Γ*))</div>
                  </div>
                </div>

                {/* CFG */}
                <div className="bg-white p-6 md:p-8 border border-slate-200/80 rounded-none shadow-sm">
                  <h4 className="text-base md:text-lg font-minecraft text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-purple-400 rounded-none"></span> Context-Free Grammar (CFG)
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    Ref: GeeksforGeeks CFG Structure
                  </p>
                  <p className="text-[14px] md:text-[16px] mb-4">
                    A <strong>Context-Free Grammar (CFG)</strong> is a formal system used to generate all possible valid strings in a formal language. Production rules define how a single variable (non-terminal) can be expanded into strings consisting of terminals and other variables.
                  </p>
                  <div className="bg-slate-50 p-5 md:p-6 border border-slate-200 font-mono text-xs md:text-sm text-slate-700 rounded-none space-y-2.5">
                    <div className="text-purple-600 font-bold text-sm md:text-base border-b border-slate-200 pb-1.5 mb-2">Mathematical Definition (4-Tuple): G = (V, T, P, S)</div>
                    <div>• <strong>V</strong>: Finite set of non-terminal variables (e.g., {"{S, A, B}"})</div>
                    <div>• <strong>T</strong>: Finite set of terminal characters (e.g., {"{0, 1}"} or {"{a, b}"})</div>
                    <div>• <strong>P</strong>: Finite set of production rules mapping variables to strings (V → (V ∪ T)*)</div>
                    <div>• <strong>S</strong>: Designated start variable symbol (S ∈ V)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SECTION 2: COMPILER CORE FEATURES */}
          {/* ============================================================ */}
          {activeSection === "FEATURES" && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-2xl md:text-3xl font-minecraft text-slate-900 border-b border-slate-100 pb-3 mb-6 uppercase flex items-center gap-3">
                <Cpu className="w-7 h-7 text-amber-500" /> List of features supported by the Automata Compiler
              </h3>

              <div className="space-y-6 text-sm md:text-base text-slate-600 leading-relaxed font-sans">
                <div className="grid grid-cols-1 gap-4">
                  {/* FEATURE 1 */}
                  <div className="bg-white p-5 border-l-4 border-amber-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      Compiler Selector
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Users can navigate between the <strong>DFA Visualizer</strong>, <strong>PDA Simulator</strong>, and <strong>CFG Compiler</strong> using the top navigation bar to validate strings against different formal models. While these compilers were built from scratch closely following formal definitions, some visual compromises were made to simplify the user experience.
                    </p>
                  </div>

                  {/* FEATURE 2 */}
                  <div className="bg-white p-5 border-l-4 border-sky-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      Operational Trace / Transition Table
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Provides real-time, step-by-step information detailing the operations of the selected automaton. For instance, in the <strong>DFA Visualizer</strong>, the Transition Table shows each character being read and its corresponding processing status. If the compiler fails, a meaningful error message is returned detailing the cause of failure.
                    </p>
                  </div>

                  {/* FEATURE 3 */}
                  <div className="bg-white p-5 border-l-4 border-[#0077B6] border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      Compiler Result
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Displays a straightforward message derived from the processing trace, confirming whether the input string is <strong>"ACCEPTED,"</strong> <strong>"REJECTED,"</strong> or currently <strong>"IDLE/PROCESSING"</strong> by the automaton.
                    </p>
                  </div>

                  {/* FEATURE 4 */}
                  <div className="bg-white p-5 border-l-4 border-blue-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      State Visualization
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Displays a dynamic, node-based graph of the automaton, highlighting the active state and the sequence of transitions as each character in the input string is processed. The visualization also includes interactive controls for zooming in, zooming out, and enabling full-screen mode to provide a clearer and more detailed view of the structure.
                    </p>
                  </div>

                  {/* FEATURE 5 */}
                  <div className="bg-white p-5 border-l-4 border-emerald-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      Animated Stack Memory (PDA Simulator Only)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Visually represents the Last-In-First-Out (LIFO) stack memory used by the Pushdown Automaton. It displays how each character is pushed to or popped from the stack as the input is read, identifying the state responsible for the action and emphasizing the current top of the stack.
                    </p>
                  </div>

                  {/* FEATURE 6 */}
                  <div className="bg-white p-5 border-l-4 border-purple-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      Derivation Workflow & Grammar (CFG Compiler Only)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Displays the defined production rules alongside a sequential derivation workflow, illustrating how the source string is expanded from the start variable to terminal symbols.
                    </p>
                  </div>

                  {/* FEATURE 7 */}
                  <div className="bg-white p-5 border-l-4 border-rose-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      Playback Controls (DFA and PDA)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Control the pace of computation with full-featured transport keys: Play, Step Forward,  and Reset.
                    </p>
                  </div>

                  {/* FEATURE 8 */}
                  <div className="bg-white p-5 border-l-4 border-teal-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      Valid and Invalid Testbeds
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Comes pre-populated with complex edge cases and standard validation string suites, facilitating instant verification of correct and incorrect scenarios.
                    </p>
                  </div>

                  {/* FEATURE 9 */}
                  <div className="bg-white p-5 border-l-4 border-indigo-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      Multiline/Batch Processing of Strings
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Supports both single-string and multiline batch processing modes through a toggleable interface. Users can validate up to five input strings simultaneously, with each string processed independently and its corresponding result displayed.
                    </p>
                  </div>

                  {/* FEATURE 10 */}
                  <div className="bg-white p-5 border-l-4 border-violet-500 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-minecraft text-slate-800 text-xs md:text-sm uppercase tracking-wider mb-1">
                      User Manual
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600">
                      Provides an overview of automata theory, the core functionalities of the compiler suite, and a step-by-step tutorial on how to use each module. It also includes explanations of supported formal models, interface controls, input formatting rules, and sample test cases to guide users throughout the simulation process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SECTION 3: DFA GUIDE */}
          {/* ============================================================ */}
          {activeSection === "DFA" && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-2xl md:text-3xl font-minecraft text-slate-900 border-b border-slate-100 pb-3 mb-6 uppercase flex items-center gap-3">
                <Activity className="w-7 h-7 text-sky-500" /> DFA Visualizer Guide
              </h3>

              <div className="space-y-6 text-sm md:text-base text-slate-600 leading-relaxed font-sans">
                <p className="text-[14px] md:text-[16px]">
                  The <strong>DFA Visualizer</strong> allows you to load predefined regular language problems, draw their state transition diagram with clean curved lines, and step through input string processing.
                </p>

                <div className="border-l-4 border-sky-500 bg-white p-6 border border-slate-200/80 rounded-none shadow-sm space-y-4">
                  <h4 className="font-minecraft text-slate-800 text-sm md:text-base uppercase tracking-wider">Key Features & Usage Steps</h4>
                  <ul className="list-none space-y-3 text-xs md:text-sm text-slate-600">
                    <li className="flex gap-3">
                      <span className="text-sky-500 font-bold">1.</span>
                      <span><strong>Select a Problem:</strong> Choose a regex problem from the drop-down menu (e.g., Problem 1: <em>(1+0)*(11+00)(00+11)*...</em>). The state coordinates will instantly lock to their mathematically clean coordinate alignments.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-sky-500 font-bold">2.</span>
                      <span><strong>Input a Test String:</strong> Type a binary string (only containing alphabet symbols like <code>0</code> or <code>1</code>) into the test input field.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-sky-500 font-bold">3.</span>
                      <span><strong>Run Simulation:</strong> Click the blocky button controls to interact with the execution:
                        <span className="block mt-1.5 text-slate-500 pl-4 border-l border-slate-200 space-y-1">
                          • <strong>Step Forward:</strong> Advance the DFA symbol-by-symbol to observe the active state highlighting in blue.<br />
                          • <strong>Auto Play / Pause:</strong> Automatically trace the execution flow at a regular pace.<br />
                          • <strong>Reset:</strong> Immediately return the pointer back to the designated start state.
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-sky-500 font-bold">4.</span>
                      <span><strong>D3 Visual Interaction:</strong> Use the buttons in the top-right of the graph view to zoom in, zoom out, or reset zoom. Click <strong>Fullscreen ⛶</strong> to display the visualizer on a white backdrop, filling the screen.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 border border-slate-200 rounded-none text-[13px] md:text-[15px] space-y-2 text-slate-700 shadow-inner">
                  <span className="text-sky-600 font-bold uppercase tracking-wider block mb-1">State Highlights & Symbols:</span>
                  <span className="block">• <strong>Active State:</strong> Indicated by a glowing blue node and transition border.</span>
                  <span className="block">• <strong>Accept State:</strong> Rendered with a double boundary ring and highlighted green when active.</span>
                  <span className="block">• <strong>Self Loops:</strong> Placed at the top of states with circular loops so they remain clean and distinguishable.</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SECTION 4: PDA GUIDE */}
          {/* ============================================================ */}
          {activeSection === "PDA" && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-2xl md:text-3xl font-minecraft text-slate-900 border-b border-slate-100 pb-3 mb-6 uppercase flex items-center gap-3">
                <Layers className="w-7 h-7 text-emerald-500" /> PDA Simulator Guide
              </h3>

              <div className="space-y-6 text-sm md:text-base text-slate-600 leading-relaxed font-sans">
                <p className="text-[14px] md:text-[16px]">
                  The <strong>Pushdown Automaton (PDA) Simulator</strong> visualizes stack-based computation. It demonstrates how stack memory handles matching string symbols and routes transitions based on top-of-stack data.
                </p>

                <div className="border-l-4 border-emerald-500 bg-white p-6 border border-slate-200/80 rounded-none shadow-sm space-y-4">
                  <h4 className="font-minecraft text-slate-800 text-sm md:text-base uppercase tracking-wider">Key Features & Usage Steps</h4>
                  <ul className="list-none space-y-3 text-xs md:text-sm text-slate-600">
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">1.</span>
                      <span><strong>State Shape Identifiers:</strong>
                        <span className="block mt-1.5 text-slate-500 pl-4 border-l border-slate-200 space-y-1">
                          • <strong>Rounded Square / Oblong:</strong> Used to render the <code>START</code> and <code>ACCEPT</code> states.<br />
                          • <strong>Diamond shape:</strong> Used to render the intermediate <code>READ</code> states.
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">2.</span>
                      <span><strong>Isolated Start Node:</strong> The <code>START</code> state is placed further to the left, separating it visually from the rest of the read states to make entry points highly clear.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">3.</span>
                      <span><strong>Transition Syntax:</strong> Paths display transition rules in the standard format <code>a, b → c</code>, where:
                        <span className="block mt-1.5 text-slate-500 pl-4 border-l border-slate-200 space-y-1">
                          • <strong>a:</strong> Input symbol consumed (or <code>ε</code> for epsilon transition).<br />
                          • <strong>b:</strong> Symbol popped from stack (or <code>ε</code> if stack pop is ignored).<br />
                          • <strong>c:</strong> Symbol pushed to stack (or <code>ε</code> if nothing is pushed).
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">4.</span>
                      <span><strong>Live Stack Visualizer:</strong> View the current elements in the stack displayed in a dedicated blocky table alongside the state visualizer. The stack updates in real-time as you advance.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 border border-slate-200 rounded-none text-[13px] md:text-[15px] text-slate-700 shadow-inner">
                  <span className="text-emerald-600 font-bold uppercase tracking-wider block mb-1">Epsilon (ε) Transitions:</span>
                  <span className="block">• Epsilon transitions (no input character consumed) are fully supported and executed automatically between Q9/q14/q15 and the terminal ACCEPT state, showing the active flow dynamically.</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SECTION 5: CFG GUIDE */}
          {/* ============================================================ */}
          {activeSection === "CFG" && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-2xl md:text-3xl font-minecraft text-slate-900 border-b border-slate-100 pb-3 mb-6 uppercase flex items-center gap-3">
                <Terminal className="w-7 h-7 text-purple-500" /> CFG Compiler Guide
              </h3>

              <div className="space-y-6 text-sm md:text-base text-slate-600 leading-relaxed font-sans">
                <p className="text-[14px] md:text-[16px]">
                  The <strong>CFG Compiler</strong> maps regular languages to context-free production rules and runs a parsing engine to find derivations for valid strings.
                </p>

                <div className="border-l-4 border-purple-500 bg-white p-6 border border-slate-200/80 rounded-none shadow-sm space-y-4">
                  <h4 className="font-minecraft text-slate-800 text-sm md:text-base uppercase tracking-wider">Key Features & Usage Steps</h4>
                  <ul className="list-none space-y-3 text-xs md:text-sm text-slate-600">
                    <li className="flex gap-3">
                      <span className="text-purple-500 font-bold">1.</span>
                      <span><strong>Grammar & Productions Side-by-Side:</strong> View the formal 4-tuple mathematical definition $G = (V, T, P, S)$ on the left, and a vertically aligned scrolling container of production rules on the right for clean conservation of screen space.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-500 font-bold">2.</span>
                      <span><strong>Vertical Derivation Steps:</strong> Click "Validate" on an input string to see the leftmost derivation flow drawn vertically in sequential rows:
                        <span className="block mt-1.5 text-purple-600 pl-4 border-l border-slate-200 flex items-center gap-1 font-minecraft text-[12px] md:text-[14px]">
                          <CornerDownRight className="w-4 h-4 text-purple-500" /> S ⇒ 1A ⇒ 111111 ...
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-500 font-bold">3.</span>
                      <span><strong>Variable Highlighting:</strong> The leftmost variable currently selected for expansion in each row is dynamically highlighted in <strong>purple text</strong>, with detailed step notifications stating exactly what variable was replaced and what it was substituted with (e.g., <code>λ</code> empty strings).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-500 font-bold">4.</span>
                      <span><strong>Advanced Pruning:</strong> The engine validates strings in under 2ms using deep BFS heuristics (terminal count validation and matching-prefix pruning) to filter incorrect paths immediately.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 border border-slate-200 rounded-none text-[13px] md:text-[15px] text-slate-700 shadow-inner">
                  <span className="text-purple-600 font-bold uppercase tracking-wider block mb-1">Epsilon (λ) Lambda Notation:</span>
                  <span className="block">• In production rules, empty string replacements are represented by the lambda character <code>λ</code>, which cleanly wipes out variables to finalize terminal-only strings.</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

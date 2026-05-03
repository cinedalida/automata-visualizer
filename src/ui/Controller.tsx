import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  StepForward,
  RotateCcw,
  Settings,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";
import DFASimulatorUI from "../dfa/DFASimulatorUI";
import PDASimulatorUI from "../pda/PDASimulatorUI";
import CFGSimulatorUI from "../cfg/CFGSimulatorUI";

type Tab = "DFA" | "PDA" | "CFG";

export default function Controller() {
  const [activeTab, setActiveTab] = useState<Tab>("DFA");

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "DFA", label: "DFA Visualizer", icon: Activity },
    { id: "PDA", label: "PDA Simulator", icon: Layers },
    { id: "CFG", label: "CFG Compiler", icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-[image:var(--image-sunset)] bg-cover bg-center bg-fixed text-slate-200">
      {/* 
         IMPORTANT: Add this next line to create a dark tint. 
         Without this, your white text will be impossible to read against the bright sunset.
      */}
      <div className="min-h-screen bg-slate-550/50 backdrop-blur-[1px]">
      

      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              Σ
            </div>
            <div>
<<<<<<< HEAD
              <h1 className="text-4xl font-minecraft text-white uppercase leading-none mb-1">
                Automata <span className="text-indigo-400">Compiler</span>
=======
              <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-none mb-1">
                Automata{" "}
                <span className="text-indigo-400 font-normal">Compiler</span>
>>>>>>> origin/main
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                DFA • PDA • CFG Processor
              </p>
            </div>
          </div>

          <nav className="flex gap-2 bg-slate-900/50 p-1.5 rounded-full border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-2 px-6 py-2 rounded-full text-base font-minecraft transition-all uppercase tracking-widest ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                  id={`tab-${tab.id.toLowerCase()}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-tight">
                System Ready
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === "DFA" && <DFASimulatorUI />}
            {activeTab === "PDA" && <PDASimulatorUI />}
            {activeTab === "CFG" && <CFGSimulatorUI />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-slate-500 text-[10px] uppercase tracking-widest font-mono">
          <span>Automata Engine v2.4.0</span>
          <span>© 2026 Formal Systems Lab</span>
        </div>
      </footer>
    </div>
    </div>
  );
}

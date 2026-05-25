import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Activity, Layers } from "lucide-react";
import DFASimulatorUI from "../dfa/DFASimulatorUI";
import PDASimulatorUI from "../pda/PDASimulatorUI";
import CFGSimulatorUI from "../cfg/CFGSimulatorUI";
import wallpaperImage from "../images/mc_wallpaper_movie_vista_1920x1080.png";

type Tab = "DFA" | "PDA" | "CFG";

export default function Controller() {
  const [activeTab, setActiveTab] = useState<Tab>("DFA");

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "DFA", label: "DFA Visualizer", icon: Activity },
    { id: "PDA", label: "PDA Simulator", icon: Layers },
    { id: "CFG", label: "CFG Compiler", icon: Terminal },
  ];

  return (
    <div
      className="min-h-screen bg-dirt-full font-minecraft relative"
      style={{
        backgroundImage: `url(${wallpaperImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >

      {/* HEADER: Exactly #212121 with Navigation on the right */}
      <header className="bg-[#212121] shadow-xl relative z-50">
        <div className="relative z-10 max-w-[1550px] mx-auto px-8 py-4 flex flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl md:text-5xl tracking-tighter uppercase leading-none flex gap-x-4">
              <span className="relative">
                <span className="absolute inset-0 text-transparent bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text z-10">Automata</span>
                <span className="minecraft-logo-shadow text-black">Automata</span>
              </span>
              <span className="relative">
                <span className="absolute inset-0 text-transparent bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text z-10">Compiler</span>
                <span className="minecraft-logo-shadow text-black">Compiler</span>
              </span>
            </h1>
            <p className="text-[14px] text-white/80 tracking-[0.5em] uppercase font-minecraft mc-text-shadow">
              DFA • PDA • CFG
            </p>
          </div>

          {/* NAVIGATION: Right side, exactly following the reference style */}
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative px-8 py-4 transition-all uppercase text-[18px] tracking-widest font-bold
                    flex items-center justify-center border-[1px]
                    ${isActive
                      ? "border-[#88d9f1] bg-black/40 text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                    }
                  `}
                >
                  <span className={isActive ? "underline underline-offset-8 decoration-2" : ""}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main
        className="relative min-h-[calc(100vh-120px)] p-4 md:p-8 z-10"
        style={{
          backgroundImage: `url(${wallpaperImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        <div className="max-w-[1550px] mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === "DFA" && <DFASimulatorUI />}
              {activeTab === "PDA" && <PDASimulatorUI />}
              {activeTab === "CFG" && <CFGSimulatorUI />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-[#212121] border-t border-slate-700/50 py-10 relative z-20 font-sans text-slate-300">
        <div className="max-w-[1550px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo / Title Area */}
          <div className="flex flex-col items-center md:items-start gap-1 max-w-sm">
            <span className="text-[14px] text-white font-bold uppercase tracking-widest">Automata Visualizer</span>
            <span className="text-[11px] text-slate-400 font-medium leading-normal text-center md:text-left">
              A DFA visualizer with CFG and PDA conversion
            </span>
            <span className="text-[10px] text-[#88d9f1] font-semibold uppercase tracking-wider mt-1 text-center md:text-left">
              Subject: AUTOMATA THEORY AND FORMAL LANGUAGES (S-CSPC327)
            </span>
          </div>

          {/* Credits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 text-center sm:text-left text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Backend Development</span>
              <span className="text-white font-semibold">Francine Dalida</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Frontend Development</span>
              <span className="text-white font-semibold">Criselda Perdito, Kyle Panganiban</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Documentation</span>
              <span className="text-white font-semibold">Rona Dalistan</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .minecraft-logo-shadow {
          -webkit-text-stroke: 5px black;
          paint-order: stroke fill;
        }
      `}</style>
    </div>
  );
}
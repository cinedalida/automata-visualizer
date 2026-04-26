import React, { useState, useEffect, useRef } from 'react';
import { Play, StepForward, RotateCcw, AlertCircle, CheckCircle2, Terminal, Info, Database, Layers, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PDA_EXAMPLES } from './pdaData';
import { PDASimulator } from './pdaSimulator';
import D3Graph from '../visualization/D3Graph';
import { REGEX_1, REGEX_2 } from '../constants';

interface StackItem {
  id: string;
  symbol: string;
}

export default function PDASimulatorUI() {
  const [regexInput, setRegexInput] = useState(REGEX_1);
  const [selectedPdaKey, setSelectedPdaKey] = useState<keyof typeof PDA_EXAMPLES>('pda1');
  const [isValidRegex, setIsValidRegex] = useState(true);
  const [inputString, setInputString] = useState('110101');
  const [currentStateId, setCurrentStateId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stack, setStack] = useState<StackItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  
  const simulatorRef = useRef<PDASimulator | null>(null);
  const pda = PDA_EXAMPLES[selectedPdaKey];

  useEffect(() => {
    const trimmed = regexInput.trim();
    if (trimmed === REGEX_1) {
      setSelectedPdaKey('pda1');
      setIsValidRegex(true);
    } else if (trimmed === REGEX_2) {
      setSelectedPdaKey('pda2');
      setIsValidRegex(true);
    } else if (trimmed === '0^n1^n') {
      setSelectedPdaKey('pda3');
      setIsValidRegex(true);
      setInputString('000111');
    } else {
      setIsValidRegex(false);
    }
  }, [regexInput]);

  useEffect(() => {
    reset();
  }, [selectedPdaKey]);

  const isRunningRef = useRef(false);
  const [activeTransitionIdx, setActiveTransitionIdx] = useState<number | undefined>(undefined);

  const reset = () => {
    isRunningRef.current = false;
    simulatorRef.current = new PDASimulator(pda, inputString);
    setCurrentStateId(simulatorRef.current.getCurrentStateId());
    setCurrentIndex(0);
    setStack([...simulatorRef.current.getStack()]);
    setHistory([...simulatorRef.current.getHistory()]);
    setActiveTransitionIdx(undefined);
    setIsFinished(false);
    setIsAccepted(false);
  };

  const step = () => {
    if (!simulatorRef.current) return;
    
    const moved = simulatorRef.current.step();
    if (moved) {
      setCurrentStateId(simulatorRef.current.getCurrentStateId());
      setCurrentIndex(simulatorRef.current.getCurrentIndex());
      setStack([...simulatorRef.current.getStack()]);
      setHistory([...simulatorRef.current.getHistory()]);
      setActiveTransitionIdx(simulatorRef.current.getLastTransitionIdx() ?? undefined);
      
      if (simulatorRef.current.isFinished() && !simulatorRef.current.hasEpsilonTransition()) {
        setIsFinished(true);
        setIsAccepted(simulatorRef.current.isAccepted());
      }
      return true;
    } else {
      setIsFinished(true);
      setIsAccepted(simulatorRef.current.isAccepted());
      return false;
    }
  };

  const run = async () => {
    if (isRunningRef.current || isFinished) return;
    isRunningRef.current = true;
    
    // Continue as long as we are running and not finished with both input and epsilons
    while (isRunningRef.current && simulatorRef.current && !isFinished) {
      const moved = step();
      if (!moved) break;
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
    
    isRunningRef.current = false;
  };

  const historyEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    reset();
  }, [inputString]);

  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-6 min-h-[700px]">
      {/* Header/Controls Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-slate-900/50 border border-slate-900 rounded-3xl p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="font-bold text-white uppercase text-xs tracking-widest">PDA Controller</h2>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-400 font-mono">STACK_MODE</span>
        </div>

        <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-3 tracking-widest">Select Regex Problem</label>
            <div className="relative mb-6">
              <select
                value={regexInput}
                onChange={(e) => setRegexInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-mono text-xs text-indigo-300 appearance-none cursor-pointer"
              >
                <option value={REGEX_1}>Problem 1: (1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)* (101+111) (101+111)* (1+0*+11) (1+0*+11)*</option>
                <option value={REGEX_2}>Problem 2: (bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb) (a+b)* (aa+bb)</option>
                <option value="0^n1^n">Problem 3: 0^n1^n (Context-Free Language)</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-slate-600 rotate-90" />
              </div>
            </div>

            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-3 tracking-widest">Input Stream</label>
            <div className="relative">
              <input
                type="text"
                value={inputString}
                onChange={(e) => setInputString(e.target.value.toLowerCase())}
                placeholder="aabb..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-mono text-indigo-300 text-lg tracking-widest"
              />
              <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
            </div>
          </div>
          
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
            <span className="text-[10px] text-slate-600 font-bold uppercase block mb-3">Operational Status</span>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isFinished ? (isAccepted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]') : 'bg-indigo-500 animate-pulse'}`}></div>
              <span className={`text-xs font-bold tracking-widest ${isFinished ? (isAccepted ? 'text-emerald-400' : 'text-rose-400') : 'text-indigo-400'}`}>
                {isFinished ? (isAccepted ? 'VALID_STATE' : 'ERROR_STATE') : 'SIMULATING...'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/50 flex gap-3">
          <button onClick={run} disabled={isFinished} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold transition-all disabled:opacity-30">
            <Play className="w-4 h-4 fill-white" /> RUN
          </button>
          <button onClick={step} disabled={isFinished} className="w-14 h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-full flex items-center justify-center disabled:opacity-30 border border-slate-700">
            <StepForward className="w-5 h-5" />
          </button>
          <button onClick={reset} className="w-14 h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-full flex items-center justify-center border border-slate-700">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDA Visualizer Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-4 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl">
        <div className="absolute top-6 left-6 z-10">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Network Visualization</h3>
        </div>
        <div className="flex items-center justify-center h-full">
          {isValidRegex ? (
            <D3Graph 
              states={pda.states} 
              transitions={pda.transitions.map(t => ({
                from: t.from,
                to: t.to,
                symbol: `${t.input || 'ε'}, ${t.pop || 'ε'}→${t.push || 'ε'}`
              }))} 
              activeStateId={currentStateId}
              activeTransitionIdx={activeTransitionIdx}
              width={750}
              height={400}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-slate-700">
              <AlertCircle className="w-16 h-16 opacity-10" />
              <p className="text-xs font-bold uppercase tracking-widest">PDA Compiler: Verification Failed</p>
            </div>
          )}
        </div>
      </div>

      {/* Stack View Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden shadow-xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 shrink-0">PDA Stack View</h3>
        <div className="flex-grow flex flex-col-reverse gap-2 items-center justify-start min-h-[150px] bg-slate-950 p-6 rounded-2xl border border-slate-800 border-b-4 border-b-indigo-600 overflow-y-auto custom-scrollbar">
          <div className="bg-indigo-900/40 border border-indigo-500/30 w-full max-w-[120px] py-2 text-center text-[10px] font-mono text-indigo-400 rounded-lg shrink-0 mb-2">
            BOTTOM ($)
          </div>
          <AnimatePresence initial={false}>
            {stack.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ scale: 0.8, opacity: 0, y: -40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0, x: 50, transition: { duration: 0.5 } }}
                transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.6 }}
                layout
                className={`w-full max-w-[140px] py-4 flex items-center justify-center rounded-xl border font-mono font-bold text-sm transition-all shrink-0 shadow-lg ${
                  idx === stack.length - 1 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-white/30 text-white shadow-indigo-500/40 ring-2 ring-white/10' 
                    : 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700/50 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`opacity-20 text-[10px] ${idx === stack.length - 1 ? 'text-white' : 'text-slate-500'}`}>#{idx}</span>
                  <span className="tracking-widest">{item.symbol}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Operational Trace Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-2 bg-slate-900/50 border border-slate-900 rounded-3xl p-6 flex flex-col overflow-hidden shadow-lg hover:shadow-indigo-500/5 transition-all">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Operational Trace</h3>
            <span className="text-[10px] bg-indigo-600/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-600/20 font-mono">LIVE_LOGS</span>
          </div>
          <span className="text-[10px] text-slate-600 font-mono animate-pulse">T_INDEX: {currentIndex}</span>
        </div>
        <div className="font-mono text-[11px] space-y-1.5 flex-grow overflow-y-auto pr-4 custom-scrollbar">
          {history.length > 0 ? history.map((log, idx) => (
            <motion.p 
              key={idx} 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${idx === history.length - 1 ? 'text-indigo-400 font-bold bg-indigo-600/5 p-1 rounded' : 'text-slate-500'}`}
            >
              <span className="opacity-30 mr-2">[{idx.toString().padStart(2, '0')}]</span>
              {log}
            </motion.p>
          )) : (
            <div className="flex items-center justify-center h-full text-slate-700 uppercase tracking-widest text-[10px] italic">
              Awaiting execution sequence...
            </div>
          )}
          <div ref={historyEndRef} />
        </div>
      </div>
    </div>
  );
}

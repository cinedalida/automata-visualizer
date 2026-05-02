import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  StepForward,
  RotateCcw,
  Terminal,
  Database,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PDA_EXAMPLES } from "./pdaData";
import { PDASimulator } from "./pdaSimulator";
import D3Graph from "../visualization/D3Graph";
import { REGEX_1, REGEX_2 } from "../constants";

interface StackItem {
  id: string;
  symbol: string;
}

interface StackViewProps {
  stack: StackItem[];
  bottomLabel: string;
}

function StackView({ stack, bottomLabel }: StackViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [stack.length]);

  return (
    <div className="h-full min-h-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 p-4">
        <div
          ref={containerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          <div className="mx-auto flex w-full max-w-[210px] flex-col-reverse gap-3 items-center pb-3">
            <div className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 text-center text-xs uppercase tracking-[0.35em] text-slate-400">
              {bottomLabel}
            </div>
            <AnimatePresence initial={false}>
              {stack.length > 0 ? (
                stack.map((item, idx) => {
                  const symbolLabel = item.symbol?.trim() || "ε";
                  const isTop = idx === stack.length - 1;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className={`w-full rounded-xl border px-4 py-3 text-center text-lg font-semibold tracking-[0.16em] ${
                        isTop
                          ? "bg-indigo-700 border-indigo-600 text-white shadow-xl shadow-indigo-900/30"
                          : "bg-white border-slate-200 text-slate-900 shadow-sm"
                      }`}
                    >
                      {symbolLabel}
                    </motion.div>
                  );
                })
              ) : (
                <div className="w-full rounded-xl border border-dashed border-slate-700 bg-slate-900/40 py-10 text-center text-sm text-slate-500">
                  Stack is empty
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PDASimulatorUI() {
  const [regexInput, setRegexInput] = useState(REGEX_1);
  const [selectedPdaKey, setSelectedPdaKey] =
    useState<keyof typeof PDA_EXAMPLES>("pda1");
  const [isValidRegex, setIsValidRegex] = useState(true);
  const [inputString, setInputString] = useState("110101");
  const [currentStateId, setCurrentStateId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stack, setStack] = useState<StackItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [activeTransitionIdx, setActiveTransitionIdx] = useState<
    number | undefined
  >(undefined);

  const simulatorRef = useRef<PDASimulator | null>(null);
  const isRunningRef = useRef(false);
  const pda = PDA_EXAMPLES[selectedPdaKey];

  const PDA_SAMPLE_STRINGS: Record<
    keyof typeof PDA_EXAMPLES,
    { valid: string[]; invalid: string[] }
  > = {
    pda1: {
      valid: ["00110101101", "1111010111", "00111110101"],
      invalid: ["0011010", "1111010", "00111110"],
    },
    pda2: {
      valid: ["babbabaaaabbaa", "bbabaaaaaabaaabb", "bbabbbbbbbabbbaa"],
      invalid: ["aba", "abab", "bbb"],
    },
    pda3: {
      valid: ["000111", "00001111", "001111"],
      invalid: ["00111", "00011", "011"],
    },
  };

  const currentSamples = PDA_SAMPLE_STRINGS[selectedPdaKey];

  // Sync Regex Selection
  useEffect(() => {
    const trimmed = regexInput.trim();
    if (trimmed === REGEX_1) {
      setSelectedPdaKey("pda1");
      setIsValidRegex(true);
    } else if (trimmed === REGEX_2) {
      setSelectedPdaKey("pda2");
      setIsValidRegex(true);
    } else if (trimmed === "0^n1^n") {
      setSelectedPdaKey("pda3");
      setIsValidRegex(true);
      setInputString("000111");
    } else {
      setIsValidRegex(false);
    }
  }, [regexInput]);

  // Reset Simulation State
  const reset = () => {
    isRunningRef.current = false;
    simulatorRef.current = new PDASimulator(pda, inputString);
    setCurrentStateId(simulatorRef.current.getCurrentStateId());
    setCurrentIndex(0);
    // Use getStack() copy to ensure React detects state changes
    setStack([...simulatorRef.current.getStack()]);
    setHistory([...simulatorRef.current.getHistory()]);
    setActiveTransitionIdx(undefined);
    setIsFinished(false);
    setIsAccepted(false);
  };

  useEffect(() => {
    reset();
  }, [selectedPdaKey, inputString]);

  // Execution Step
  const step = () => {
    if (!simulatorRef.current) return false;

    const moved = simulatorRef.current.step();
    if (moved) {
      setCurrentStateId(simulatorRef.current.getCurrentStateId());
      setCurrentIndex(simulatorRef.current.getCurrentIndex());
      // Critical: Ensure stack items have unique IDs for stable keys[cite: 1, 3]
      setStack([...simulatorRef.current.getStack()]);
      setHistory([...simulatorRef.current.getHistory()]);
      setActiveTransitionIdx(
        simulatorRef.current.getLastTransitionIdx() ?? undefined,
      );

      if (simulatorRef.current.isFinished()) {
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

  // Automated Execution Sequence
  const run = async () => {
    if (isRunningRef.current || isFinished) return;
    isRunningRef.current = true;

    while (
      isRunningRef.current &&
      simulatorRef.current &&
      !simulatorRef.current.isFinished()
    ) {
      // Fast-track epsilon steps (400ms) vs input consumption (1200ms)
      const isEpsilon = simulatorRef.current.hasEpsilonTransition();
      const moved = step();
      if (!moved) break;

      await new Promise((resolve) =>
        setTimeout(resolve, isEpsilon ? 400 : 1200),
      );
    }
    isRunningRef.current = false;
  };

  // Trace scroll sync removed to keep browser scroll position fixed.
  // History will update without page-level scrolling.

  return (
    <div className="grid grid-cols-12 grid-rows-6 gap-6 min-h-[700px] lg:h-[calc(100vh-200px)] p-4 bg-slate-950">
      {/* Controller Section */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="font-bold text-white uppercase text-xs tracking-widest">
              PDA Controller
            </h2>
          </div>
        </div>

        <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">
                Select Regex Problem
              </label>
              <select
                value={regexInput}
                onChange={(e) => setRegexInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-indigo-300 font-mono cursor-pointer"
              >
                <option value={REGEX_1}>
                  Problem 1: (1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)*
                  (101+111) (101+111)* (1+0 *+11) (1+0* +11 ) *
                </option>
                <option value={REGEX_2}>
                  Problem 2: (bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb)
                  (a+b)* (aa+bb)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">
                Input Stream
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value.toLowerCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono text-indigo-300"
                />
                <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Valid examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentSamples.valid.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setInputString(sample)}
                      className="rounded-2xl border border-emerald-500/30 px-3 py-2 text-xs font-mono text-emerald-300 hover:bg-emerald-500/10 transition"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Invalid examples
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentSamples.invalid.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setInputString(sample)}
                      className="rounded-2xl border border-rose-500/30 px-3 py-2 text-xs font-mono text-rose-300 hover:bg-rose-500/10 transition"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${isFinished ? (isAccepted ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]") : "bg-indigo-500 animate-pulse"}`}
                ></div>
                <span
                  className={`text-[11px] font-bold tracking-widest ${isFinished ? (isAccepted ? "text-emerald-400" : "text-rose-400") : "text-indigo-400"}`}
                >
                  {isFinished
                    ? isAccepted
                      ? "VALID_STATE"
                      : "ERROR_STATE"
                    : "SIMULATING..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/50 flex gap-3">
          <button
            onClick={run}
            disabled={isFinished}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full py-3 text-xs font-bold transition-all disabled:opacity-30"
          >
            RUN
          </button>
          <button
            onClick={step}
            disabled={isFinished}
            className="bg-slate-800 text-white rounded-full p-3 border border-slate-700 transition-all hover:bg-slate-700 disabled:opacity-30"
          >
            <StepForward size={18} />
          </button>
          <button
            onClick={reset}
            className="bg-slate-800 text-white rounded-full p-3 border border-slate-700 transition-all hover:bg-slate-700"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Network Visualizer Section */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-4 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl p-6 pt-16">
        <div className="absolute top-6 left-6 z-10">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            State Visualization
          </h3>
        </div>
        <D3Graph
          states={pda.states}
          transitions={pda.transitions.map((t) => ({
            from: t.from,
            to: t.to,
            symbol: `${t.input || "ε"}, ${t.pop || "ε"}→${t.push || "ε"}`,
          }))}
          activeStateId={currentStateId}
          activeTransitionIdx={activeTransitionIdx}
          width={750}
          height={400}
        />
      </div>

      {/* Vertical Layered Stack Section - Matches Image Style */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 h-full min-h-0 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden shadow-xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Stack View
        </h3>
        <StackView stack={stack} bottomLabel="BOTTOM ($)" />
      </div>

      {/* Operational Trace Section */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Operational Trace
          </h3>
        </div>
        <div className="font-mono text-[11px] space-y-1.5 flex-grow overflow-y-auto pr-4 custom-scrollbar">
          {history.map((log, idx) => (
            <motion.p
              key={idx}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={
                idx === history.length - 1
                  ? "text-indigo-400 font-bold"
                  : "text-slate-500"
              }
            >
              <span className="opacity-30 mr-2">
                [{idx.toString().padStart(2, "0")}]
              </span>{" "}
              {log}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}

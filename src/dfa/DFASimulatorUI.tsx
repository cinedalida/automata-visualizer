import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  StepForward,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Info,
  Terminal,
  ChevronRight,
} from "lucide-react";
import { DFA_EXAMPLES } from "./dfaData";
import { DFASimulator } from "./dfaSimulator";
import D3Graph from "../visualization/D3Graph";
import { REGEX_1, REGEX_2 } from "../constants";

export default function DFASimulatorUI() {
  const [regexInput, setRegexInput] = useState(REGEX_1);
  const [selectedDfaKey, setSelectedDfaKey] =
    useState<keyof typeof DFA_EXAMPLES>("dfa1");
  const [isValidRegex, setIsValidRegex] = useState(true);

  const [inputString, setInputString] = useState("111111");
  const [currentStateId, setCurrentStateId] = useState("");
  const [activeTransitionIdx, setActiveTransitionIdx] = useState<
    number | undefined
  >(undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const simulatorRef = useRef<DFASimulator | null>(null);
  const dfa = DFA_EXAMPLES[selectedDfaKey];

  const DFA_SAMPLE_STRINGS: Record<
    keyof typeof DFA_EXAMPLES,
    { valid: string[]; invalid: string[] }
  > = {
    dfa1: {
      valid: ["111111", "0011010", "1111010", "00111110"],
      invalid: ["11111", "00111", "010101010101", "1100000000"],
    },
    dfa2: {
      valid: ["babababbb", "babaabbaa", "ababaaa", "aabaabb"],
      invalid: ["baabaaa", "babababa", "baba", "aaaa"],
    },
  };

  const currentSamples = DFA_SAMPLE_STRINGS[selectedDfaKey];

  useEffect(() => {
    const trimmed = regexInput.trim();
    if (trimmed === REGEX_1) {
      setSelectedDfaKey("dfa1");
      setIsValidRegex(true);
    } else if (trimmed === REGEX_2) {
      setSelectedDfaKey("dfa2");
      setIsValidRegex(true);
    } else {
      setIsValidRegex(false);
    }
  }, [regexInput]);

  useEffect(() => {
    if (selectedDfaKey === "dfa1") {
      setInputString("111111");
    } else {
      setInputString("ababaaa");
    }
  }, [selectedDfaKey]);

  const isRunningRef = useRef(false);

  const reset = () => {
    isRunningRef.current = false;
    simulatorRef.current = new DFASimulator(dfa, inputString);
    setCurrentStateId(simulatorRef.current.getCurrentStateId());
    setCurrentIndex(0);
    setActiveTransitionIdx(undefined);
    setIsFinished(false);
    setIsAccepted(false);
  };

  const step = () => {
    if (!simulatorRef.current) {
      simulatorRef.current = new DFASimulator(dfa, inputString);
    }
    if (simulatorRef.current.isFinished()) return false;
    const moved = simulatorRef.current.step();
    setCurrentStateId(simulatorRef.current.getCurrentStateId());
    setCurrentIndex(simulatorRef.current.getCurrentIndex());
    setActiveTransitionIdx(simulatorRef.current.getLastTransitionIdx() ?? undefined);
    if (simulatorRef.current.isFinished()) {
      setIsFinished(true);
      setIsAccepted(simulatorRef.current.isAccepted());
    }
    return moved;
  };

  const run = async () => {
    if (isRunningRef.current || isFinished) return;
    isRunningRef.current = true;
    while (isRunningRef.current && simulatorRef.current && !simulatorRef.current.isFinished()) {
      const moved = step();
      if (!moved) break;
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    isRunningRef.current = false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowed = dfa.alphabet;
    const filtered = e.target.value.split("").filter((ch) => allowed.includes(ch)).join("");
    setInputString(filtered);
  };

  useEffect(() => {
    reset();
  }, [inputString]);

  return (
    <div 
      className="grid grid-cols-12 lg:grid-rows-6 gap-6 min-h-[850px] lg:h-[880px]"
      style={{ fontFamily: "'Comfortaa', sans-serif" }} // Applying Comfortaa globally to the UI
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap');`}
      </style>
 
      {/* Control Panel Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-white/70 border border-white rounded-none p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-[20px] font-bold text-black uppercase tracking-widest leading-none">
            DFA Visualizer
          </h3>
        </div>

        <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-3 tracking-widest">
              Select Regex Problem
            </label>
            <div className="relative mb-4">
              <select
                value={regexInput}
                onChange={(e) => setRegexInput(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-none px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 text-xs text-slate-800 appearance-none cursor-pointer hover:border-slate-300 transition-all font-medium pr-10"
              >
                <option value={REGEX_1}>
                  Problem 1: (1+0)* (11+00)...
                </option>
                <option value={REGEX_2}>
                  Problem 2: (bab)* (b+a)...
                </option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-slate-500 rotate-90" />
              </div>
            </div>

            {/* Premium Full View Expression Display Box */}
            <div className="mb-6 p-4 bg-[#0077B6]/5 border border-[#0077B6]/10 text-[11px] text-slate-800 leading-relaxed font-bold break-words rounded-none">
              <span className="text-[9px] uppercase tracking-widest text-[#0077B6] block mb-1">Full Selected Problem:</span>
              {regexInput === REGEX_1 
                ? "Problem 1: (1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)* (101+111) (101+111)* (1+0*+11) (1+0*+11)*"
                : "Problem 2: (bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb) (a+b)* (aa+bb)"
              }
            </div>

            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-3 tracking-widest">
              Test String
              <span className="ml-2 text-slate-700 normal-case">
                (allowed: {dfa.alphabet.join(", ")})
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputString}
                onChange={handleInputChange}
                placeholder={`Enter ${dfa.alphabet.join("/")} sequence...`}
                className="w-full bg-white border border-slate-200/80 rounded-none px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 text-xs text-slate-800 appearance-none hover:border-slate-300 transition-all font-medium"
              />
              <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
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
                      className="rounded-none bg-white border border-emerald-200/60 px-3.5 py-2.5 text-xs text-emerald-700 font-bold hover:bg-emerald-50/80 hover:text-emerald-800 hover:border-emerald-400 hover:shadow-sm transition-all duration-200 cursor-pointer"
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
                      className="rounded-none bg-white border border-rose-200/60 px-3.5 py-2.5 text-xs text-rose-700 font-bold hover:bg-rose-50/80 hover:text-rose-800 hover:border-rose-400 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 flex gap-3">
          <button
            onClick={run}
            disabled={isFinished}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 px-6 rounded-none flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-emerald-600/10 hover:shadow-lg disabled:opacity-30 transition-all duration-200 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" /> RUN
          </button>
          <button
            onClick={step}
            disabled={isFinished}
            className="bg-white border border-slate-200 text-slate-700 rounded-none p-3.5 transition-all duration-200 hover:bg-blue-50 hover:text-[#0077B6] hover:border-blue-200 shadow-sm disabled:opacity-30 cursor-pointer"
          >
            <StepForward className="w-5 h-5" />
          </button>
          <button
            onClick={reset}
            className="bg-white border border-slate-200 text-slate-700 rounded-none p-3.5 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visualizer Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-6 bg-white/70 border border-white rounded-none overflow-hidden relative shadow-2xl p-6 pt-16">
        <div className="absolute top-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest">
            State Visualization
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>States: <span className="text-[#0077B6]">{dfa.states.length}</span></span>
            <span>Alphabet: <span className="text-[#0077B6]">{"{"}{dfa.alphabet.join(", ")}{"}"}</span></span>
            <span>Transitions: <span className="text-[#0077B6]">{dfa.transitions.length}</span></span>
            <span>Accept: <span className="text-[#0077B6]">{dfa.states.filter((s) => s.isAccept).map((s) => s.id).join(", ")}</span></span>
          </div>
        </div>

        <div className="flex items-center justify-center h-full">
          {isValidRegex ? (
            <D3Graph
              states={dfa.states}
              transitions={dfa.transitions}
              activeStateId={currentStateId}
              activeTransitionIdx={activeTransitionIdx}
              width={750}
              height={600}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-slate-700">
              <AlertCircle className="w-16 h-16 opacity-10" />
              <p className="text-xs font-bold uppercase tracking-widest">
                Compiler Error: Build Failed
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Logs Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-white/70 border border-white/70 rounded-none p-6 flex flex-col overflow-hidden">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-6 shrink-0">
          Transition Table
        </h3>
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white p-4 rounded-none text-[11px] leading-relaxed">
            <p className="text-slate-500 mb-2">Initialize DFA processor...</p>
            <p className="text-black">δ(q_start, Σ) {"->"} q_next</p>
            <p className="text-slate-600 mt-1 mb-4">
              Σ = {"{"}
              {dfa.alphabet.join(", ")}
              {"}"}
            </p>
            <div className="mt-4 space-y-1">
              {inputString.split("").map((char, idx) => {
                const isActive = idx === currentIndex;
                const isProcessed = idx < currentIndex;
                return (
                  <p
                    key={idx}
                    className={`flex justify-between items-center px-3 py-1.5 rounded-none transition-all duration-200 ${
                      isActive
                        ? "text-[#023E8A] bg-blue-50/80 font-bold border border-blue-100/50"
                        : isProcessed
                          ? "text-[#0077B6]/80 font-medium"
                          : "text-slate-400"
                    }`}
                  >
                    <span>Step {idx + 1}: Read '{char}'</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold">
                      {isActive
                        ? "processing"
                        : isProcessed
                          ? "q_resolved"
                          : "pending"}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div
            className={
              "bg-white border p-4 rounded-none transition-all duration-300 flex items-center justify-between " +
              (isFinished
                ? isAccepted
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
                : "bg-slate-50 border-slate-200")
            }
          >
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                Compiler Result
              </span>
              <span
                className={
                  "text-sm font-black tracking-widest " +
                  (isFinished
                    ? isAccepted
                      ? "text-emerald-600"
                      : "text-rose-600"
                    : "text-slate-600")
                }
              >
              {isFinished
                ? isAccepted
                  ? "ACCEPTED"
                  : "REJECTED"
                : "IDLE"}
              </span>
            </div>
            {isFinished &&
              (isAccepted ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-bounce" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-400 animate-pulse" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
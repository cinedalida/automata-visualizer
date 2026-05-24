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
      className="grid grid-cols-12 lg:grid-rows-6 gap-6 min-h-[700px] lg:h-[calc(100vh-200px)]"
      style={{ fontFamily: "'Comfortaa', sans-serif" }} // Applying Comfortaa globally to the UI
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap');`}
      </style>
 
      {/* Control Panel Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-white/70 border border-white rounded-3xl p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-[14px] font-semibold text-black uppercase tracking-widest">
            DFA Visualizer
          </h3>
        </div>

        <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-3 tracking-widest">
              Select Regex Problem
            </label>
            <div className="relative mb-6">
              <select
                value={regexInput}
                onChange={(e) => setRegexInput(e.target.value)}
                className="w-full bg-white border border-white/70 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue transition-all text-xs text-blue appearance-none cursor-pointer"
              >
                <option value={REGEX_1}>
                  Problem 1: (1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)*
                  (101+111) (101+111)* (1+0*+11) (1+0*+11)*
                </option>
                <option value={REGEX_2}>
                  Problem 2: (bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb)
                  (a+b)* (aa+bb)
                </option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-black rotate-90" />
              </div>
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
                className="w-full bg-white border border-white/70 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue transition-all text-xs text-black appearance-none cursor-pointer"
              />
              <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
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
                      className="rounded-2xl bg-black border border-white/70 px-3 py-2 text-xs text-emerald-500 transition"
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
                      className="rounded-2xl bg-black border border-white/70 px-3 py-2 text-xs text-rose-500 transition"
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
            className="flex-1 bg-emerald-700 hover:bg-emerald-400 text-white py-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-30 transition-all"
          >
            <Play className="w-4 h-4 fill-white" /> RUN
          </button>
          <button
            onClick={step}
            disabled={isFinished}
            className="bg-[#212121] text-white rounded-full p-3 border transition-all hover:bg-emerald-500 disabled:opacity-30"
          >
            <StepForward className="w-5 h-5" />
          </button>
          <button
            onClick={reset}
            className="bg-[#212121] text-white rounded-full p-3 border transition-all hover:bg-emerald-500"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visualizer Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-4 bg-white/70 border border-white rounded-3xl overflow-hidden relative shadow-2xl p-6 pt-16">
        <div className="absolute top-6 left-6 z-10">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest">
            State Visualization
          </h3>
        </div>

        <div className="flex items-center justify-center h-full">
          {isValidRegex ? (
            <D3Graph
              states={dfa.states}
              transitions={dfa.transitions}
              activeStateId={currentStateId}
              activeTransitionIdx={activeTransitionIdx}
              width={750}
              height={450}
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
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-white/70 border border-white/70 rounded-3xl p-6 flex flex-col overflow-hidden">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 shrink-0">
          Transition Table
        </h3>
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white p-4 rounded-2xl text-[11px] leading-relaxed">
            <p className="text-slate-500 mb-2">Initialize DFA processor...</p>
            <p className="text-black">δ(q_start, Σ) {"->"} q_next</p>
            <p className="text-slate-600 mt-1 mb-4">
              Σ = {"{"}
              {dfa.alphabet.join(", ")}
              {"}"}
            </p>
            <div className="mt-4 space-y-1">
              {inputString.split("").map((char, idx) => (
                <p
                  key={idx}
                  className={
                    "flex justify-between " +
                    (idx === currentIndex
                      ? "text-white font-bold"
                      : idx < currentIndex
                        ? "text-indigo-500"
                        : "text-slate-700")
                  }
                >
                  <span>Step {idx + 1}: Read '{char}'</span>
                  <span>
                    {idx < currentIndex
                      ? "-> q_resolved"
                      : idx === currentIndex
                        ? "-> processing"
                        : ""}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div
            className={
              "bg-white p-4 rounded-2xl transition-all duration-300 flex items-center justify-between " +
              (isFinished
                ? isAccepted
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-rose-500/10 border-rose-500/30"
                : "bg-slate-950 border-slate-800")
            }
          >
            <div>
              <span className="text-[10px] text-black font-bold uppercase block mb-1">
                Compiler Result
              </span>
              <span
                className={
                  "text-sm font-black tracking-widest " +
                  (isFinished
                    ? isAccepted
                      ? "text-emerald-500"
                      : "text-rose-400"
                    : "text-black")
                }
              >
                {isFinished
                  ? isAccepted
                    ? "ACCEPTED"
                    : "REJECTED"
                  : "IDLE_STATE"}
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

      {/* Expression Context Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-1.5 bg-white/70 border border-white/70 rounded-3xl p-6 flex flex-col gap-6 lg:flex-row items-start lg:items-center">
        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
          <Info className="w-8 h-8 text-black opacity-50" />
        </div>
        <div className="flex-grow">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-2">
            Automata Regular Expression
          </h3>
          <p className="text-sm text-black leading-relaxed max-w-2xl">
            {selectedDfaKey === "dfa1"
              ? "(1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)* (101+111) (101+111)* (1+0*+11) (1+0*+11)*"
              : "(bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb) (a+b)* (aa+bb)"}
          </p>
          <div className="flex gap-4 mt-3">
            <span className="text-[10px] text-black">
              States: {dfa.states.length}
            </span>
            <span className="text-[10px] text-black">
              Alphabet: {"{"}
              {dfa.alphabet.join(", ")}
              {"}"}
            </span>
            <span className="text-[10px] text-black">
              Transitions: {dfa.transitions.length}
            </span>
            <span className="text-[10px] text-black">
              Accept:{" "}
              {dfa.states
                .filter((s) => s.isAccept)
                .map((s) => s.id)
                .join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
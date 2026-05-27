import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  StepForward,
  RotateCcw,
  Terminal,
  Database,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
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
    <div 
      className="h-full min-h-0 overflow-hidden rounded-none border border-white/50 bg-white/30 p-4"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-none border border-slate-200 bg-slate-50/50 p-4">
        <div
          ref={containerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          <div className="mx-auto flex w-full max-w-[210px] flex-col-reverse gap-3 items-center pb-3">
            <div className="w-full rounded-none border border-slate-200 bg-white py-3 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
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
                      className={`w-full rounded-none border px-4 py-3 text-center text-lg font-bold tracking-[0.16em] ${
                        isTop
                          ? "bg-[#0077B6] border-[#023E8A] text-white shadow-xl shadow-blue-200"
                          : "bg-white border-slate-200 text-slate-900 shadow-sm"
                      }`}
                    >
                      {symbolLabel}
                    </motion.div>
                  );
                })
              ) : (
                <div className="w-full rounded-none border border-dashed border-slate-300 bg-white/50 py-10 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Empty
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

  const [isBatchMode, setIsBatchMode] = useState(false);
  const [inputStrings, setInputStrings] = useState<string[]>(["111111", "0011010", "1111010"]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [batchResults, setBatchResults] = useState<
    Record<number, { isFinished: boolean; isAccepted: boolean }>
  >({});
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);

  const inputString = inputStrings[activeIndex] || "";
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
      valid: ["111111", "0011010", "1111010", "00111110"],
      invalid: ["11111", "00111", "010101010101", "1100000000"],
    },
    pda2: {
      valid: ["babababbb", "babaabbaa", "ababaaa", "aabaabb"],
      invalid: ["baabaaa", "babababa", "baba", "aaaa"],
    },
  };

  const currentSamples = PDA_SAMPLE_STRINGS[selectedPdaKey];

  useEffect(() => {
    const trimmed = regexInput.trim();
    if (trimmed === REGEX_1) {
      setSelectedPdaKey("pda1");
      setIsValidRegex(true);
    } else if (trimmed === REGEX_2) {
      setSelectedPdaKey("pda2");
      setIsValidRegex(true);
    } else {
      setIsValidRegex(false);
    }
  }, [regexInput]);

  useEffect(() => {
    if (selectedPdaKey === "pda1") {
      setInputStrings(["111111", "0011010", "1111010"]);
      setActiveIndex(0);
      setBatchResults({});
    } else {
      setInputStrings(["ababaaa", "babababbb", "babaabbaa"]);
      setActiveIndex(0);
      setBatchResults({});
    }
  }, [selectedPdaKey]);

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

  useEffect(() => {
    reset();
  }, [selectedPdaKey, inputString]);

  const step = () => {
    if (!simulatorRef.current) return false;
    const moved = simulatorRef.current.step();
    if (moved) {
      setCurrentStateId(simulatorRef.current.getCurrentStateId());
      setCurrentIndex(simulatorRef.current.getCurrentIndex());
      setStack([...simulatorRef.current.getStack()]);
      setHistory([...simulatorRef.current.getHistory()]);
      setActiveTransitionIdx(simulatorRef.current.getLastTransitionIdx() ?? undefined);
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

  const run = async () => {
    if (isRunningRef.current || isFinished) return;
    isRunningRef.current = true;
    while (isRunningRef.current && simulatorRef.current && !simulatorRef.current.isFinished()) {
      const isEpsilon = simulatorRef.current.hasEpsilonTransition();
      const moved = step();
      if (!moved) break;
      await new Promise((resolve) => setTimeout(resolve, isEpsilon ? 400 : 1200));
    }
    isRunningRef.current = false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allowed = pda.alphabet;
    const filtered = e.target.value.split("").filter((ch) => allowed.includes(ch)).join("");
    const newStrings = [...inputStrings];
    newStrings[activeIndex] = filtered;
    setInputStrings(newStrings);
    // Reset batch result for this index
    setBatchResults((prev) => {
      const next = { ...prev };
      delete next[activeIndex];
      return next;
    });
  };

  const handleBatchInputChange = (index: number, val: string) => {
    const allowed = pda.alphabet;
    const filtered = val.split("").filter((ch) => allowed.includes(ch)).join("");
    const newStrings = [...inputStrings];
    newStrings[index] = filtered;
    setInputStrings(newStrings);
    // Reset batch result for this index
    setBatchResults((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleAddInputRow = () => {
    if (inputStrings.length >= 5) return;
    setInputStrings([...inputStrings, ""]);
  };

  const handleDeleteInputRow = (index: number) => {
    if (inputStrings.length <= 1) return;
    const newStrings = inputStrings.filter((_, idx) => idx !== index);
    setInputStrings(newStrings);
    
    // adjust active index if needed
    if (activeIndex >= newStrings.length) {
      setActiveIndex(newStrings.length - 1);
    }
    
    // adjust batch results
    const newResults: Record<number, { isFinished: boolean; isAccepted: boolean }> = {};
    let newIdx = 0;
    inputStrings.forEach((_, idx) => {
      if (idx !== index) {
        if (batchResults[idx] !== undefined) {
          newResults[newIdx] = batchResults[idx];
        }
        newIdx++;
      }
    });
    setBatchResults(newResults);
  };

  const handleSelectString = (index: number) => {
    setActiveIndex(index);
  };

  const runBatch = () => {
    setIsLoadingBatch(true);
    setTimeout(() => {
      const newResults: Record<number, { isFinished: boolean; isAccepted: boolean }> = {};
      inputStrings.forEach((str, idx) => {
        const tempSim = new PDASimulator(pda, str);
        newResults[idx] = {
          isFinished: true,
          isAccepted: tempSim.isAccepted(),
        };
      });
      setBatchResults(newResults);
      setIsLoadingBatch(false);
    }, 800); // Satisfying progressive evaluation feel
  };

  const handleSetSingleString = (str: string) => {
    if (isBatchMode) {
      const newStrings = [...inputStrings];
      newStrings[activeIndex] = str;
      setInputStrings(newStrings);
      setBatchResults((prev) => {
        const next = { ...prev };
        delete next[activeIndex];
        return next;
      });
    } else {
      setInputStrings([str]);
      setActiveIndex(0);
      setBatchResults({});
    }
  };

  return (
    <div 
      className="grid grid-cols-12 lg:grid-rows-6 gap-6 min-h-[1000px] lg:h-[1050px]"
      style={{ fontFamily: "'Comfortaa', sans-serif" }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap');`}
      </style>

      {/* Control Panel Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-2 bg-white/70 border border-white rounded-none p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[20px] font-bold text-black uppercase tracking-widest leading-none">
              PDA Simulator
            </h3>
          </div>
        </div>

        <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
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

              <div className="flex items-center justify-between mb-3">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  Input Mode
                </label>
                <div className="flex bg-slate-100 p-0.5 rounded-none border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBatchMode(false);
                      setInputStrings([inputStrings[activeIndex] || ""]);
                      setActiveIndex(0);
                      setBatchResults({});
                    }}
                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                      !isBatchMode
                        ? "bg-white text-[#0077B6] shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Single
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBatchMode(true)}
                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                      isBatchMode
                        ? "bg-white text-[#0077B6] shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Batch (Up to 5)
                  </button>
                </div>
              </div>

              {!isBatchMode ? (
                <>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-3 tracking-widest">
                    Input Stream
                    <span className="ml-2 text-slate-700 normal-case">
                      (allowed: {pda.alphabet.join(", ")})
                    </span>
                  </label>
                  <div className="relative mb-6">
                    <input
                      type="text"
                      value={inputString}
                      onChange={handleInputChange}
                      placeholder={`Enter ${pda.alphabet.join("/")} stream...`}
                      className="w-full bg-white border border-slate-200/80 rounded-none px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 text-xs text-slate-800 appearance-none hover:border-slate-300 transition-all font-medium"
                    />
                    <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </>
              ) : (
                <div className="space-y-3 mb-6">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    Batch Streams
                    <span className="ml-2 text-slate-700 normal-case">
                      (allowed: {pda.alphabet.join(", ")})
                    </span>
                  </label>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {inputStrings.map((str, idx) => {
                      const isActive = idx === activeIndex;
                      const result = batchResults[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => handleSelectString(idx)}
                          className={`group flex items-center gap-2 p-2 border transition-all cursor-pointer rounded-none relative ${
                            isActive
                              ? "border-[#0077B6] bg-blue-50/30 shadow-sm"
                              : "border-slate-200/80 bg-white hover:border-slate-300"
                          }`}
                        >
                          {/* Active selection dot */}
                          <div className={`w-1.5 h-1.5 rounded-none flex-shrink-0 ${
                            isActive ? "bg-[#0077B6]" : "bg-transparent border border-slate-300"
                          }`} />
                          
                          <input
                            type="text"
                            value={str}
                            onChange={(e) => handleBatchInputChange(idx, e.target.value)}
                            placeholder={`String ${idx + 1}...`}
                            className="flex-grow bg-transparent text-xs font-bold text-slate-800 focus:outline-none px-1 py-1 min-w-0"
                            onClick={(e) => e.stopPropagation()} // Prevent selecting row when clicking to edit
                          />
                          
                          {/* Status Badge */}
                          {result ? (
                            result.isAccepted ? (
                              <span className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-none flex-shrink-0">
                                ✓ Valid
                              </span>
                            ) : (
                              <span className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 rounded-none flex-shrink-0">
                                ✗ Invalid
                              </span>
                            )
                          ) : (
                            <span className="text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200 rounded-none flex-shrink-0">
                              Pending
                            </span>
                          )}

                          {/* Delete Row Button */}
                          {inputStrings.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteInputRow(idx);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 text-slate-400 transition-opacity rounded-none"
                              title="Delete string"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Controls for Batch Mode */}
                  <div className="flex gap-2 items-center justify-between pt-1">
                    {inputStrings.length < 5 ? (
                      <button
                        type="button"
                        onClick={handleAddInputRow}
                        className="text-[10px] font-bold text-[#0077B6] hover:text-[#023E8A] uppercase tracking-wider flex items-center gap-1 py-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add String ({inputStrings.length}/5)
                      </button>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Max 5 strings reached
                      </span>
                    )}
                    
                    <button
                      type="button"
                      onClick={runBatch}
                      disabled={isLoadingBatch}
                      className="bg-[#0077B6] hover:bg-[#023E8A] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 shadow-sm rounded-none transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingBatch ? "Running..." : "Run Batch"}
                    </button>
                  </div>
                </div>
              )}
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
                      onClick={() => handleSetSingleString(sample)}
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
                      onClick={() => handleSetSingleString(sample)}
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

      {/* State Visualizer Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-4 bg-white/70 border border-white rounded-none overflow-hidden relative shadow-2xl p-6 pt-16">
        <div className="absolute top-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest">
            State Visualization
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>States: <span className="text-[#0077B6]">{pda.states.length}</span></span>
            <span>Alphabet: <span className="text-[#0077B6]">{"{"}{pda.alphabet.join(", ")}{"}"}</span></span>
            <span>Transitions: <span className="text-[#0077B6]">{pda.transitions.length}</span></span>
            <span>Accept: <span className="text-[#0077B6]">{pda.states.filter((s) => s.isAccept).map((s) => s.id).join(", ")}</span></span>
          </div>
        </div>

        <div className="flex items-center justify-center h-full">
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
            height={600}
          />
        </div>
      </div>

      {/* Stack View Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-2 bg-white/70 border border-white rounded-none p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest">
            Stack Memory
          </h3>
          <span className="text-[10px] bg-blue-50 px-2 py-1 rounded-none text-[#023E8A] font-bold">
            DEPTH: {stack.length}
          </span>
        </div>
        <StackView stack={stack} bottomLabel="BOTTOM ($)" />
      </div>

      {/* Operational Trace Bento Box */}
      <div className="col-span-12 lg:col-span-12 lg:row-span-2 bg-white/70 border border-white rounded-none p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest">
            Operational Trace
          </h3>
          <div
            className={
              "px-4 py-2 rounded-none border transition-all duration-300 flex items-center gap-3 " +
              (isFinished
                ? isAccepted
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
                : "bg-slate-100 border-slate-200")
            }
          >
            <span
              className={
                "text-[10px] font-black tracking-widest " +
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
                : "SIMULATING..."}
            </span>
            {isFinished &&
              (isAccepted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ))}
          </div>
        </div>
        <div className="text-[11px] flex-grow overflow-y-auto pr-4 custom-scrollbar bg-slate-50 border border-slate-200/80 p-4 rounded-none">
          {history.length === 0 ? (
            <p className="text-slate-400 uppercase tracking-widest text-[10px]">
              Waiting for processor initialization...
            </p>
          ) : (
            history.map((log, idx) => (
              <motion.p
                key={idx}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={
                  "leading-relaxed " + 
                  (idx === history.length - 1
                    ? "text-[#0077B6] font-bold"
                    : "text-slate-500")
                }
              >
                <span className="opacity-30 mr-2 text-[9px]">
                  [{idx.toString().padStart(2, "0")}]
                </span>{" "}
                {log}
              </motion.p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
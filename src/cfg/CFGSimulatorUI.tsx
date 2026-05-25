import { useState, useEffect } from "react";
import {
  Send,
  Terminal,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { CFG_EXAMPLES } from "./cfgData";
import { CFGEngine, DerivationResult } from "./cfgEngine";
import { motion } from "motion/react";
import { REGEX_1, REGEX_2 } from "../constants";

export default function CFGSimulatorUI() {
  const [regexInput, setRegexInput] = useState(REGEX_1);
  const [selectedCfgKey, setSelectedCfgKey] =
    useState<keyof typeof CFG_EXAMPLES>("cfg1");
  const [isValidRegex, setIsValidRegex] = useState(true);
  const [inputString, setInputString] = useState("111111");
  const [result, setResult] = useState<DerivationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const cfg = CFG_EXAMPLES[selectedCfgKey];

  const CFG_SAMPLE_STRINGS: Record<
    keyof typeof CFG_EXAMPLES,
    { valid: string[]; invalid: string[] }
  > = {
    cfg1: {
      valid: ["111111", "0011010", "1111010", "00111110"],
      invalid: ["11111", "00111", "010101010101", "1100000000"],
    },
    cfg2: {
      valid: ["babababbb", "babaabbaa", "ababaaa", "aabaabb"],
      invalid: ["baabaaa", "babababa", "baba", "aaaa"],
    },
  };

  const currentSamples = CFG_SAMPLE_STRINGS[selectedCfgKey];

  useEffect(() => {
    const trimmed = regexInput.trim();
    if (trimmed === REGEX_1) {
      setSelectedCfgKey("cfg1");
      setIsValidRegex(true);
    } else if (trimmed === REGEX_2) {
      setSelectedCfgKey("cfg2");
      setIsValidRegex(true);
    } else {
      setIsValidRegex(false);
    }
  }, [regexInput]);

  useEffect(() => {
    setResult(null);
    if (selectedCfgKey === "cfg1") {
      setInputString("111111");
    } else {
      setInputString("ababaaa");
    }
  }, [selectedCfgKey]);

  const handleInputChange = (value: string) => {
    const allowed = cfg.terminals;
    const filtered = value
      .split("")
      .filter((ch) => allowed.includes(ch))
      .join("");
    setInputString(filtered);
  };

  const validate = () => {
    if (!isValidRegex) return;
    setIsValidating(true);
    setTimeout(() => {
      const engine = new CFGEngine(cfg);
      const res = engine.validate(inputString);
      setResult(res);
      setIsValidating(false);
    }, 3000);
  };

  return (
    <div 
      className="grid grid-cols-12 lg:grid-rows-6 gap-6 min-h-[850px] lg:h-[880px]"
      style={{ fontFamily: "'Comfortaa', sans-serif" }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap');`}
      </style>

      {/* Compiler Console Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-white/70 border border-white rounded-none p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-[20px] font-bold text-black uppercase tracking-widest leading-none">
            CFG Compiler
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
              Source String
              <span className="ml-2 text-slate-700 normal-case">
                (allowed: {cfg.terminals.join(", ")})
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputString}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Enter ${cfg.terminals.join("/")} string...`}
                className="w-full bg-white border border-slate-200/80 rounded-none px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 text-xs text-slate-800 appearance-none hover:border-slate-300 transition-all font-medium"
              />
              <button
                onClick={validate}
                disabled={isValidating || !inputString}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-white hover:bg-emerald-400 rounded-none disabled:opacity-30 transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
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

          <div
            className={
              "p-4 rounded-none border transition-all duration-300 flex items-center justify-between " +
              (result?.isAccepted
                ? "bg-emerald-50 border-emerald-200"
                : result
                ? "bg-rose-50 border-rose-200"
                : "bg-slate-50 border-slate-200")
            }
          >
            <div>
              <span className="text-[10px] text-slate-600 font-bold uppercase block mb-1">
                Compiler Status
              </span>
              <span
                className={
                  "text-sm font-black tracking-widest " +
                  (result
                    ? result.isAccepted
                      ? "text-emerald-600"
                      : "text-rose-600"
                    : "text-slate-600")
                }
              >
                {isValidating
                  ? "PARSING..."
                  : result
                  ? result.isAccepted
                    ? "SUCCESS"
                    : "REJECTED"
                  : "IDLE"}
              </span>
            </div>
            {result &&
              (result.isAccepted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 leading-relaxed italic">
            [SYS] Performing BFS sentential expansion... Max depth 50k.
          </p>
        </div>
      </div>

      {/* Grammar Rules Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-3 bg-white/70 border border-white rounded-none p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 h-full min-h-0">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-6">
            GRAMMAR
          </h3>
          <div className="h-full min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {isValidRegex ? (
                Object.entries(cfg.productions).map(([v, prods]) => (
                  <div
                    key={v}
                    className="bg-white/80 p-4 rounded-none border border-slate-100 shadow-sm"
                  >
                    <span className="text-[10px] text-[#0077B6] font-bold block mb-1">
                      {v}
                    </span>
                    <div className="text-sm font-bold text-slate-700">
                      {prods.map((p) => (p === "" ? "ε" : p)).join(" | ")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  &lt; Compilation Required &gt;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Derivation Steps Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-3 bg-white/70 border border-white rounded-none p-6 flex flex-col overflow-hidden shadow-xl">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h3 className="text-xs font-bold text-black uppercase tracking-widest">
            Derivation Workflow
          </h3>
          {result?.isAccepted && (
            <span className="text-[10px] bg-blue-50 px-2 py-1 rounded-none text-[#023E8A] font-bold">
              {result.steps.length} CYCLES
            </span>
          )}
          {result && !result.isAccepted && (
            <span className="text-[10px] bg-rose-50 px-2 py-1 rounded-none text-rose-700 font-bold">
              FAILED AT CYCLE {result.steps.length - 1}
            </span>
          )}
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {isValidating ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full"
              />
              <span className="text-slate-400 animate-pulse text-[10px] uppercase font-bold tracking-widest">
                Generating Traces...
              </span>
            </div>
          ) : result?.isAccepted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {result.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-none bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    S{idx}
                  </div>
                  <div className="flex-grow h-[1px] bg-slate-100 group-hover:bg-blue-100 transition-colors"></div>
                  <div
                    className={
                      "text-sm px-3 py-1 rounded-none border " +
                      (idx === 0
                        ? "bg-blue-50 border-blue-100 text-[#023E8A] font-bold"
                        : idx === result.steps.length - 1
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600 font-bold"
                        : "bg-white border-slate-100 text-slate-600")
                    }
                  >
                    {step === "" ? "ε" : step}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : result ? (
            <div className="flex flex-col gap-6">
              {result.steps.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {result.steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-none bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                        S{idx}
                      </div>
                      <div className="flex-grow h-[1px] bg-slate-100 group-hover:bg-rose-100 transition-colors"></div>
                      <div
                        className={
                          "text-sm px-3 py-1 rounded-none border " +
                          (idx === 0
                            ? "bg-blue-50 border-blue-100 text-[#023E8A] font-bold"
                            : idx === result.steps.length - 1
                            ? "bg-rose-50 border-rose-200 text-rose-600 font-bold"
                            : "bg-white border-slate-100 text-slate-600")
                        }
                      >
                        {step === "" ? "ε" : step}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Premium Compiler Diagnostics Console */}
              <div className="p-5 bg-rose-50 border border-rose-200 text-slate-800 rounded-none shrink-0">
                <div className="flex items-center gap-3 text-rose-600 mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                    COMPILER ERROR: PARSING_EXCEPTION
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div className="p-3 bg-white border border-slate-100">
                    <span className="text-slate-400 text-[9px] uppercase block tracking-widest font-normal mb-1">Parsed Portion:</span>
                    <span className="text-emerald-600 font-mono text-xs break-all">
                      {inputString.slice(0, result.matchedLength) || "ε (None)"}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-100">
                    <span className="text-slate-400 text-[9px] uppercase block tracking-widest font-normal mb-1">Unexpected Suffix/Token:</span>
                    <span className="text-rose-600 font-mono text-xs break-all">
                      {inputString.slice(result.matchedLength) ? `"${inputString.slice(result.matchedLength)}"` : "EOF (End of File)"}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-4 pt-3 border-t border-rose-100">
                  The compiler successfully parsed the green prefix but encountered a syntax mismatch with the remaining red suffix. No valid productions from the active variables in state <span className="font-bold text-slate-800">"{result.steps[result.steps.length - 1] || cfg.startSymbol}"</span> can derive the rest of the target string.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-300">
              <Terminal className="w-16 h-16 opacity-10" />
              <p className="text-xs uppercase tracking-widest font-bold">
                Awaiting Source...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CFG Summary Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-white/70 border border-white rounded-none p-6 flex flex-col overflow-hidden">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-6 shrink-0">
          Parsing Logic
        </h3>
        <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white p-5 rounded-none border border-white/50">
            <h4 className="text-[9px] font-bold text-black uppercase mb-3 tracking-widest">
              Grammar Metrics
            </h4>
            <div className="space-y-2">
              <p className="text-[11px] text-black">
                Variables: <span className="text-black">{cfg.variables.length}</span>
              </p>
              <p className="text-[11px] text-black">
                Alphabet: <span className="text-black">{"{"}{cfg.terminals.join(", ")}{"}"}</span>
              </p>
              <p className="text-[11px] text-black">
                Complexity: <span className="text-black">Type 2 (CFG)</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[10px] text-black font-bold uppercase tracking-tighter">
            Mode: Sentential_Expansion
          </span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-none bg-emerald-500"></div>
            <div className="w-1.5 h-1.5 rounded-none bg-emerald-300"></div>
            <div className="w-1.5 h-1.5 rounded-none bg-emerald-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
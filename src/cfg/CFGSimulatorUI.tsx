import { useState, useEffect } from "react";
import {
  Send,
  Terminal,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Hash,
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
  const [inputString, setInputString] = useState("111111"); // CHANGED: valid default
  const [result, setResult] = useState<DerivationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const cfg = CFG_EXAMPLES[selectedCfgKey];

  // ============================================================
  // Sample strings that match the corrected DFAs/CFGs
  // ============================================================
  const CFG_SAMPLE_STRINGS: Record<
    keyof typeof CFG_EXAMPLES,
    { valid: string[]; invalid: string[] }
  > = {
    cfg1: {
      valid: [
        "111111", // 11(double) 1(bridge) 111(pattern)
        "0011010", // 00(double) 1(bridge) 101(pattern) 0(tail)
        "1111010", // 11(double) 1(bridge) 101(pattern) 0(tail)
        "00111110", // 00(double) 1(bridge) 111(pattern) 10(tail)
      ],
      invalid: [
        "11111", // too short, pattern incomplete
        "00111", // too short, pattern incomplete
        "010101010101", // no double (00 or 11) found
        "1100000000", // no pattern (101 or 111) found
      ],
    },
    cfg2: {
      valid: [
        "babababbb", // bab(L1) a(L2) bab(L3) bb(tail)
        "babaabbaa", // bab(L1) a(L2) aba(L3) ...aa(tail)
        "ababaaa", // a(L2) bab(L3) aa(tail)
        "aabaabb", // a(L2) aba(L3) bb(tail)
      ],
      invalid: [
        "baabaaa", // baa triggers trap at q4
        "babababa", // ends in a, tail requires aa or bb
        "baba", // too short, missing pattern
        "aaaa", // no valid bab/aba pattern
      ],
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

  // ============================================================
  // Reset input string when switching CFG
  // ============================================================
  useEffect(() => {
    setResult(null);
    // Set a sensible default input for each CFG
    if (selectedCfgKey === "cfg1") {
      setInputString("111111");
    } else {
      setInputString("ababaaa");
    }
  }, [selectedCfgKey]);

  // ============================================================
  // Get valid characters for current CFG
  // ============================================================
  const getAllowedChars = (): string[] => {
    return cfg.terminals;
  };

  // ============================================================
  // Filter input to only allow valid terminal symbols
  // ============================================================
  const handleInputChange = (value: string) => {
    const allowed = getAllowedChars();
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
    <div className="grid grid-cols-12 lg:grid-rows-6 gap-6 min-h-[700px] lg:h-[calc(100vh-200px)]">
      {/* Compiler Console Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-slate-900/50 border border-slate-900 rounded-3xl p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600/20 p-2 rounded-lg border border-emerald-500/30">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="font-bold text-white uppercase text-xs tracking-widest">
              CFG Compiler
            </h2>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">
            CFG_PARSER
          </span>
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
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-mono text-xs text-emerald-400 appearance-none cursor-pointer"
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
                <ChevronRight className="w-4 h-4 text-slate-600 rotate-90" />
              </div>
            </div>

            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-3 tracking-widest">
              Source String
              {/* Show which characters are allowed */}
              <span className="ml-2 text-slate-700 normal-case">
                (allowed: {cfg.terminals.join(", ")})
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputString}
                // Use filtered input handler
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Enter ${cfg.terminals.join("/")} string...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-mono text-emerald-400 text-lg tracking-widest"
              />
              <button
                onClick={validate}
                disabled={isValidating || !inputString}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white disabled:opacity-30 transition-all shadow-lg shadow-emerald-600/20"
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
          </div>

          <div
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${result?.isAccepted ? "bg-emerald-500/10 border-emerald-500/30" : result ? "bg-rose-500/10 border-rose-500/30" : "bg-slate-950 border-slate-800"}`}
          >
            <div>
              <span className="text-[10px] text-slate-600 font-bold uppercase block mb-1">
                Status
              </span>
              <span
                className={`text-sm font-black tracking-widest ${result ? (result.isAccepted ? "text-emerald-400" : "text-rose-400") : "text-slate-500"}`}
              >
                {isValidating
                  ? "PARSING..."
                  : result
                    ? result.isAccepted
                      ? "VALID_GRAMMAR"
                      : "REJECTED"
                    : "IDLE"}
              </span>
            </div>
            {result &&
              (result.isAccepted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ))}
          </div>
        </div>

        {/* UPDATED: Footer message matches new engine settings */}
        <div className="mt-8 pt-6 border-t border-slate-800/50">
          <p className="text-[10px] text-slate-600 leading-relaxed font-mono italic">
            [SYS] Performing BFS sentential form expansion... Max depth 50000
            nodes. Variables sorted by length for multi-char safety.
          </p>
        </div>
      </div>

      {/* Grammar Rules Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        ></div>

        <div className="relative z-10 h-full min-h-0">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            Formal Grammar (G)
          </h3>
          <div className="h-full min-h-0 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {isValidRegex ? (
                Object.entries(cfg.productions).map(([v, prods]) => (
                  <div
                    key={v}
                    className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50"
                  >
                    <span className="text-[10px] text-emerald-500 font-bold block mb-1">
                      {v}
                    </span>
                    <div className="font-mono text-sm text-slate-300">
                      {/* UPDATED: Display empty productions as ε */}
                      {prods.map((p) => (p === "" ? "ε" : p)).join(" | ")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-slate-700 font-mono text-[10px] uppercase">
                  &lt; Grammar unavailable until compilation &gt;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Derivation Steps Bento Box */}
      <div className="col-span-12 lg:col-span-8 lg:row-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden shadow-xl">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Derivation Steps
          </h3>
          {/* Show step count when result exists */}
          {result?.isAccepted && (
            <span className="text-[10px] text-emerald-400 font-mono">
              {result.steps.length} steps
            </span>
          )}
          <ClipboardList className="w-4 h-4 text-slate-600" />
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {isValidating ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              />
              <span className="text-slate-500 animate-pulse text-xs uppercase tracking-widest font-mono">
                Tracing derivation...
              </span>
            </div>
          ) : result?.isAccepted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {result.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.4 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">
                    S{idx}
                  </div>
                  <div className="flex-grow h-[1px] bg-slate-800 group-hover:bg-emerald-500/30 transition-colors"></div>
                  <div
                    className={`font-mono text-sm px-3 py-1 rounded bg-slate-950/50 border border-slate-800/50 ${
                      idx === 0
                        ? "text-sky-400 border-sky-500/20" // Start symbol
                        : idx === result.steps.length - 1
                          ? "text-emerald-400 font-bold border-emerald-500/20" // Final
                          : "text-slate-400" // Intermediate
                    }`}
                  >
                    {step === "" ? "ε" : step}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : result ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
              <AlertCircle className="w-12 h-12 text-rose-500" />
              <span className="text-rose-400 text-xs font-bold uppercase tracking-widest">
                Syntax Analysis Error
              </span>
              <p className="text-slate-600 text-[10px] max-w-[250px] text-center font-mono uppercase tracking-tighter mt-2">
                "Compiler could not resolve the token sequence for the defined
                grammar productions."
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-800">
              <Terminal className="w-16 h-16 opacity-10" />
              <p className="text-xs uppercase tracking-widest font-bold">
                Waiting for input stream...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CFG Summary Bento Box */}
      <div className="col-span-12 lg:col-span-4 lg:row-span-3 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 shrink-0">
          Parsing Summary
        </h3>
        <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
            <h4 className="text-[10px] font-bold text-emerald-500 uppercase mb-2">
              Grammar Type
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detected Context-Free (Type 2). Ready for PDA mapping.
            </p>
          </div>

          {/* Current grammar stats */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">
              Grammar Stats
            </h4>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-mono">
                Variables: {cfg.variables.length}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Terminals: {cfg.terminals.join(", ")}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Productions:{" "}
                {Object.values(cfg.productions).reduce(
                  (sum, prods) => sum + prods.length,
                  0,
                )}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Start: {cfg.startSymbol}
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">
              Automata Parity
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Grammar matches the structural complexity of{" "}
              {selectedCfgKey === "cfg1" ? "DFA1" : "DFA2"} with{" "}
              {cfg.variables.length} states.
            </p>
          </div>
        </div>
        <div className="mt-auto pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <span className="text-[10px] text-slate-700 font-mono">
            GEN_MODE: BFS_SENTENTIAL
          </span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

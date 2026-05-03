import { PDA } from "../types";

export const PDA_EXAMPLES: Record<string, PDA> = {
  // ============================================================
  // PDA1: Mirrors corrected DFA1
  // Regex: (1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)* (101+111)
  //        (101+111)* (1+0*+11) (1+0*+11)*
  // Alphabet: {0, 1}
  // Stack: push-only (records input history)
  // Accept state: Q9
  // ============================================================
  pda1: {
    states: [
      { id: "Q0", label: "Q0", isStart: true, isAccept: false },
      { id: "Q1", label: "Q1", isStart: false, isAccept: false },
      { id: "Q2", label: "Q2", isStart: false, isAccept: false },
      { id: "Q3", label: "Q3", isStart: false, isAccept: false },
      { id: "Q4", label: "Q4", isStart: false, isAccept: false },
      { id: "Q5", label: "Q5", isStart: false, isAccept: false },
      { id: "Q6", label: "Q6", isStart: false, isAccept: false },
      { id: "Q7", label: "Q7", isStart: false, isAccept: false },
      { id: "Q8", label: "Q8", isStart: false, isAccept: false },
      { id: "Q9", label: "Q9", isStart: false, isAccept: true },
    ],
    alphabet: ["0", "1"],
    stackAlphabet: ["Z0", "0", "1"],
    startState: "Q0",
    startStackSymbol: "Z0",
    acceptStates: ["Q9"],
    transitions: [
      // --------------------------------------------------------
      // Layer 1: Find 00 or 11
      // --------------------------------------------------------
      { from: "Q0", to: "Q1", input: "1", pop: "", push: "1" },
      { from: "Q0", to: "Q2", input: "0", pop: "", push: "0" },

      { from: "Q1", to: "Q2", input: "0", pop: "", push: "0" },
      { from: "Q1", to: "Q3", input: "1", pop: "", push: "1" },

      { from: "Q2", to: "Q1", input: "1", pop: "", push: "1" },
      { from: "Q2", to: "Q3", input: "0", pop: "", push: "0" },

      // --------------------------------------------------------
      // Layer 2: Mandatory bridge
      // --------------------------------------------------------
      { from: "Q3", to: "Q4", input: "0", pop: "", push: "0" },
      { from: "Q3", to: "Q4", input: "1", pop: "", push: "1" },

      // --------------------------------------------------------
      // Layer 3: Seek start of 101 or 111
      // --------------------------------------------------------
      { from: "Q4", to: "Q4", input: "0", pop: "", push: "0" },
      { from: "Q4", to: "Q5", input: "1", pop: "", push: "1" },

      // --------------------------------------------------------
      // Layer 4: Detect 101 or 111
      // --------------------------------------------------------
      { from: "Q5", to: "Q6", input: "0", pop: "", push: "0" },
      { from: "Q5", to: "Q8", input: "1", pop: "", push: "1" },

      { from: "Q6", to: "Q4", input: "0", pop: "", push: "0" },
      { from: "Q6", to: "Q9", input: "1", pop: "", push: "1" },

      { from: "Q7", to: "Q4", input: "0", pop: "", push: "0" },
      { from: "Q7", to: "Q9", input: "1", pop: "", push: "1" },

      { from: "Q8", to: "Q7", input: "0", pop: "", push: "0" },
      { from: "Q8", to: "Q9", input: "1", pop: "", push: "1" },

      // --------------------------------------------------------
      // Accept state: absorb remaining input
      // --------------------------------------------------------
      { from: "Q9", to: "Q9", input: "0", pop: "", push: "0" },
      { from: "Q9", to: "Q9", input: "1", pop: "", push: "1" },
    ],
  },

  // ============================================================
  // PDA2: Mirrors corrected DFA2
  // Regex: (bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb)
  //        (a+b)* (aa+bb)
  // Alphabet: {a, b}
  // Stack: push-only (records input history)
  // Accept states: q14, q15
  // ============================================================
  pda2: {
    states: [
      { id: "q0", label: "q0", isStart: true, isAccept: false },
      { id: "q1", label: "q1", isStart: false, isAccept: false },
      { id: "q2", label: "q2", isStart: false, isAccept: false },
      { id: "q3", label: "q3", isStart: false, isAccept: false },
      { id: "q4", label: "q4", isStart: false, isAccept: false },
      { id: "q5", label: "q5", isStart: false, isAccept: false },
      { id: "q6", label: "q6", isStart: false, isAccept: false },
      { id: "q7", label: "q7", isStart: false, isAccept: false },
      { id: "q8", label: "q8", isStart: false, isAccept: false },
      { id: "q9", label: "q9", isStart: false, isAccept: false },
      { id: "q10", label: "q10", isStart: false, isAccept: false },
      { id: "q11", label: "q11", isStart: false, isAccept: false },
      { id: "q12", label: "q12", isStart: false, isAccept: false },
      { id: "q13", label: "q13", isStart: false, isAccept: false },
      { id: "q14", label: "q14", isStart: false, isAccept: true },
      { id: "q15", label: "q15", isStart: false, isAccept: true },
      { id: "T", label: "T", isStart: false, isAccept: false },
    ],
    alphabet: ["a", "b"],
    stackAlphabet: ["Z0", "a", "b"],
    startState: "q0",
    startStackSymbol: "Z0",
    acceptStates: ["q14", "q15"],
    transitions: [
      // --------------------------------------------------------
      // Layer 1: (bab)* prefix
      // --------------------------------------------------------
      { from: "q0", to: "q2", input: "a", pop: "", push: "a" },
      { from: "q0", to: "q1", input: "b", pop: "", push: "b" },

      { from: "q1", to: "q4", input: "a", pop: "", push: "a" },
      { from: "q1", to: "q3", input: "b", pop: "", push: "b" },

      { from: "q4", to: "T", input: "a", pop: "", push: "a" },
      { from: "q4", to: "q6", input: "b", pop: "", push: "b" },

      // q6: ambiguous checkpoint after 'bab'
      // on 'a' → q10 (preserved valid handoff)
      // on 'b' → q1 (continue possible prefix loop)
      { from: "q6", to: "q10", input: "a", pop: "", push: "a" },
      { from: "q6", to: "q1", input: "b", pop: "", push: "b" },

      // --------------------------------------------------------
      // Layer 2: (b+a) bridge
      // --------------------------------------------------------
      { from: "q2", to: "q3", input: "b", pop: "", push: "b" },
      { from: "q2", to: "q5", input: "a", pop: "", push: "a" },

      // --------------------------------------------------------
      // Layer 3: (bab+aba) pattern
      // --------------------------------------------------------
      { from: "q3", to: "q7", input: "a", pop: "", push: "a" },
      { from: "q3", to: "T", input: "b", pop: "", push: "b" },

      { from: "q5", to: "T", input: "a", pop: "", push: "a" },
      { from: "q5", to: "q8", input: "b", pop: "", push: "b" },

      { from: "q7", to: "q9", input: "b", pop: "", push: "b" },
      { from: "q7", to: "T", input: "a", pop: "", push: "a" },

      { from: "q8", to: "q10", input: "a", pop: "", push: "a" },
      { from: "q8", to: "T", input: "b", pop: "", push: "b" },

      // --------------------------------------------------------
      // Layer 3 completion → Layer 4
      // --------------------------------------------------------
      { from: "q9", to: "q11", input: "a", pop: "", push: "a" },
      { from: "q9", to: "q11", input: "b", pop: "", push: "b" },
      { from: "q10", to: "q11", input: "a", pop: "", push: "a" },
      { from: "q10", to: "q11", input: "b", pop: "", push: "b" },

      // --------------------------------------------------------
      // Layer 4: Tail checker (must end in aa or bb)
      // --------------------------------------------------------
      { from: "q11", to: "q12", input: "b", pop: "", push: "b" },
      { from: "q11", to: "q13", input: "a", pop: "", push: "a" },

      { from: "q12", to: "q14", input: "b", pop: "", push: "b" },
      { from: "q12", to: "q13", input: "a", pop: "", push: "a" },

      { from: "q13", to: "q12", input: "b", pop: "", push: "b" },
      { from: "q13", to: "q15", input: "a", pop: "", push: "a" },

      { from: "q14", to: "q13", input: "a", pop: "", push: "a" },
      { from: "q14", to: "q14", input: "b", pop: "", push: "b" },

      { from: "q15", to: "q15", input: "a", pop: "", push: "a" },
      { from: "q15", to: "q12", input: "b", pop: "", push: "b" },

      // --------------------------------------------------------
      // Trap state
      // --------------------------------------------------------
      { from: "T", to: "T", input: "a", pop: "", push: "a" },
      { from: "T", to: "T", input: "b", pop: "", push: "b" },
    ],
  },
};

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
      // START node (oblong/rounded square)
      {
        id: "START",
        label: "START",
        isStart: true,
        isAccept: false,
        shape: "rounded",
      },

      // READ nodes (diamond)
      {
        id: "Q0",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q1",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q2",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q3",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q4",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q5",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q6",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q7",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q8",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "Q9",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },

      // ACCEPT node (oblong/rounded square)
      {
        id: "ACCEPT",
        label: "ACCEPT",
        isStart: false,
        isAccept: true,
        shape: "rounded",
      },
    ],
    alphabet: ["0", "1"],
    stackAlphabet: ["Z0", "0", "1"],
    startState: "START",
    startStackSymbol: "Z0",
    acceptStates: ["ACCEPT"],
    transitions: [
      // --------------------------------------------------------
      // START → Q0 (epsilon transition)
      // --------------------------------------------------------
      { from: "START", to: "Q0", input: "", pop: "", push: "" },

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
      // Layer 5: Accept state, absorb remaining tail
      // --------------------------------------------------------
      { from: "Q9", to: "Q9", input: "0", pop: "", push: "0" },
      { from: "Q9", to: "Q9", input: "1", pop: "", push: "1" },

      // --------------------------------------------------------
      // Q9 → ACCEPT (epsilon transition)
      // --------------------------------------------------------
      { from: "Q9", to: "ACCEPT", input: "", pop: "", push: "" },
    ],
  },

  // ============================================================
  // PDA2
  // ============================================================
  pda2: {
    states: [
      // START node (oblong/rounded square)
      {
        id: "START",
        label: "START",
        isStart: true,
        isAccept: false,
        shape: "rounded",
      },

      // READ nodes (diamond)
      {
        id: "q0",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q1",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q2",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q3",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q4",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q5",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q6",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q7",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q8",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q9",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q10",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q11",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q12",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q13",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q14",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "q15",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },
      {
        id: "T",
        label: "READ",
        isStart: false,
        isAccept: false,
        shape: "diamond",
      },

      // ACCEPT node (oblong/rounded square)
      {
        id: "ACCEPT",
        label: "ACCEPT",
        isStart: false,
        isAccept: true,
        shape: "rounded",
      },
    ],
    alphabet: ["a", "b"],
    stackAlphabet: ["Z0", "a", "b"],
    startState: "START",
    startStackSymbol: "Z0",
    acceptStates: ["ACCEPT"],
    transitions: [
      // --------------------------------------------------------
      // START → q0 (epsilon transition)
      // --------------------------------------------------------
      { from: "START", to: "q0", input: "", pop: "", push: "" },

      // --------------------------------------------------------
      // Layer 1: (bab)* prefix
      // --------------------------------------------------------
      { from: "q0", to: "q2", input: "a", pop: "", push: "a" },
      { from: "q0", to: "q1", input: "b", pop: "", push: "b" },

      { from: "q1", to: "q4", input: "a", pop: "", push: "a" },
      { from: "q1", to: "q3", input: "b", pop: "", push: "b" },

      { from: "q4", to: "T", input: "a", pop: "", push: "a" },
      { from: "q4", to: "q6", input: "b", pop: "", push: "b" },

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

      // --------------------------------------------------------
      // q14, q15 → ACCEPT (epsilon transitions)
      // --------------------------------------------------------
      { from: "q14", to: "ACCEPT", input: "", pop: "", push: "" },
      { from: "q15", to: "ACCEPT", input: "", pop: "", push: "" },
    ],
  },
};

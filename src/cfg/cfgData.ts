import { CFG } from "../types";

export const CFG_EXAMPLES: Record<string, CFG> = {
  // ============================================================
  // CFG1: Derived from corrected DFA1
  // Regex: (1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)* (101+111)
  //        (101+111)* (1+0*+11) (1+0*+11)*
  // Alphabet: {0, 1}
  // Accept state: Q9 → ε
  // ============================================================
  cfg1: {
    variables: ["Q0", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"],
    terminals: ["0", "1"],
    startSymbol: "Q0",
    productions: {
      // Layer 1: Find 00 or 11
      Q0: ["0Q2", "1Q1"], // q0 --0--> q2, q0 --1--> q1
      Q1: ["0Q2", "1Q3"], // q1 --0--> q2, q1 --1--> q3
      Q2: ["0Q3", "1Q1"], // q2 --0--> q3, q2 --1--> q1

      // Layer 2: Mandatory bridge
      Q3: ["0Q4", "1Q4"], // q3 --0--> q4, q3 --1--> q4

      // Layer 3: Seek start of 101 or 111
      Q4: ["0Q4", "1Q5"], // q4 --0--> q4, q4 --1--> q5

      // Layer 4: Detect 101 or 111
      Q5: ["0Q6", "1Q8"], // q5 --0--> q6, q5 --1--> q8
      Q6: ["0Q4", "1Q9"], // q6 --0--> q4, q6 --1--> q9
      Q7: ["0Q4", "1Q9"], // q7 --0--> q4, q7 --1--> q9
      Q8: ["0Q7", "1Q9"], // q8 --0--> q7, q8 --1--> q9

      // Accept: only Q9 produces ε
      Q9: ["0Q9", "1Q9", ""], // q9 --0--> q9, q9 --1--> q9, ACCEPT
    },
  },

  // ============================================================
  // CFG2: Derived from corrected DFA2
  // Regex: (bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb)
  //        (a+b)* (aa+bb)
  // Alphabet: {a, b}
  // Accept states: q14, q15 → ε
  // ============================================================
  cfg2: {
    variables: [
      "q0",
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q6",
      "q7",
      "q8",
      "q9",
      "q10",
      "q11",
      "q12",
      "q13",
      "q14",
      "q15",
      "T",
    ],
    terminals: ["a", "b"],
    startSymbol: "q0",
    productions: {
      // Layer 1: (bab)* prefix
      q0: ["aq2", "bq1"], // q0 --a--> q2, q0 --b--> q1
      q1: ["aq4", "bq3"], // q1 --a--> q4, q1 --b--> q3
      q4: ["aT", "bq6"], // q4 --a--> T,  q4 --b--> q6
      q6: ["aq10", "bq1"], // q6 --a--> q10, q6 --b--> q1

      // Layer 2: (b+a) bridge
      q2: ["aq5", "bq3"], // q2 --a--> q5, q2 --b--> q3

      // Layer 3: (bab+aba) pattern
      q3: ["aq7", "bT"], // q3 --a--> q7, q3 --b--> T
      q5: ["aT", "bq8"], // q5 --a--> T,  q5 --b--> q8
      q7: ["bq9", "aT"], // q7 --b--> q9, q7 --a--> T
      q8: ["aq10", "bT"], // q8 --a--> q10, q8 --b--> T

      // Layer 3 completion → Layer 4
      q9: ["aq11", "bq11"], // q9  → tail scanner
      q10: ["aq11", "bq11"], // q10 → tail scanner

      // Layer 4: Tail checker (must end in aa or bb)
      q11: ["aq13", "bq12"], // q11 --a--> q13, q11 --b--> q12
      q12: ["bq14", "aq13"], // q12 --b--> q14, q12 --a--> q13
      q13: ["aq15", "bq12"], // q13 --a--> q15, q13 --b--> q12

      // Accept states: q14 and q15 produce ε
      q14: ["aq13", "bq14", ""], // q14 --a--> q13, q14 --b--> q14, ACCEPT
      q15: ["aq15", "bq12", ""], // q15 --a--> q15, q15 --b--> q12, ACCEPT

      // Trap: no ε production, so strings that reach T are always rejected
      T: ["aT", "bT"],
    },
  },
};

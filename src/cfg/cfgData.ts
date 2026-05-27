import { CFG } from "../types";

export const CFG_EXAMPLES: Record<string, CFG> = {
  // ============================================================
  // CFG1: Simplified Grammar for Regex 1
  // Regex: (1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)* (101+111)
  //        (101+111)* (1+0*+11) (1+0*+11)*
  // Alphabet: {0, 1}
  // ============================================================
  cfg1: {
    variables: ["S", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    terminals: ["0", "1"],
    startSymbol: "S",
    productions: {
      S: ["ABCDEFGH"],
      A: ["1A", "0A", ""],
      B: ["11", "00"],
      C: ["00C", "11C", ""],
      D: ["1", "0", "11"],
      E: ["1E", "0E", "11E", ""],
      F: ["101", "111"],
      G: ["101G", "111G", ""],
      H: ["IH", ""],
      I: ["1", "J", "11"],
      J: ["0J", ""],
    },
  },

  // ============================================================
  // CFG2: Simplified Grammar for Regex 2
  // Regex: (bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb)
  //        (a+b)* (aa+bb)
  // Alphabet: {a, b}
  // ============================================================
  cfg2: {
    variables: ["S", "A", "B", "C", "D", "E", "F", "G", "H"],
    terminals: ["a", "b"],
    startSymbol: "S",
    productions: {
      S: ["ABCDEFGH"],
      A: ["babA", ""],
      B: ["b", "a"],
      C: ["bab", "aba"],
      D: ["aD", "bD", ""],
      E: ["aaE", "bbE", ""],
      F: ["b", "a", "bb"],
      G: ["aG", "bG", ""],
      H: ["aa", "bb"],
    },
  },
};

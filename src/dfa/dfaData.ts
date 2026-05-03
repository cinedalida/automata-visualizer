import { DFA } from "../types";

export const DFA1: DFA = {
  states: [
    { id: "q0", label: "q0", isStart: true, isAccept: false },
    { id: "q1", label: "q1", isStart: false, isAccept: false }, // Saw '1'
    { id: "q2", label: "q2", isStart: false, isAccept: false }, // Saw '0'
    { id: "q3", label: "q3", isStart: false, isAccept: false }, // DOUBLE FOUND
    { id: "q4", label: "q4", isStart: false, isAccept: false }, // BRIDGE SATISFIED / Seeking '1'
    { id: "q5", label: "q5", isStart: false, isAccept: false }, // Saw '1' (Pattern Start)
    { id: "q6", label: "q6", isStart: false, isAccept: false }, // Saw '10'
    { id: "q7", label: "q7", isStart: false, isAccept: false }, // Saw '110' (Recovery)
    { id: "q8", label: "q8", isStart: false, isAccept: false }, // Saw '11'
    { id: "q9", label: "q9", isStart: false, isAccept: true }, // ACCEPT / TAIL
  ],
  alphabet: ["0", "1"],
  transitions: [
    // ============================================================
    // LAYER 1: Finding (00+11)
    // ============================================================
    { from: "q0", to: "q1", symbol: "1" },
    { from: "q0", to: "q2", symbol: "0" },
    { from: "q1", to: "q3", symbol: "1" }, // Found '11'
    { from: "q1", to: "q2", symbol: "0" },
    { from: "q2", to: "q3", symbol: "0" }, // Found '00'
    { from: "q2", to: "q1", symbol: "1" },

    // ============================================================
    // LAYER 2: Bridge (1+0+11)
    // Moving from q3 to q4 satisfies the mandatory 1-char requirement of the bridge
    // ============================================================
    { from: "q3", to: "q4", symbol: "0" },
    { from: "q3", to: "q4", symbol: "1" },

    // ============================================================
    // LAYER 3 & 4: Mandatory (101+111)
    // q4 acts as the ground for the (1+0+11)* bridge part
    // ============================================================
    { from: "q4", to: "q4", symbol: "0" },
    { from: "q4", to: "q5", symbol: "1" }, // Potential start of 101 or 111

    { from: "q5", to: "q6", symbol: "0" }, // Sequence '10...'
    { from: "q5", to: "q8", symbol: "1" }, // Sequence '11...'

    { from: "q6", to: "q4", symbol: "0" }, // '100' fails pattern, back to seeking '1'
    { from: "q6", to: "q9", symbol: "1" }, // '101' COMPLETED! → Accept

    { from: "q8", to: "q7", symbol: "0" }, // '110' (Needs a '1' to make '101' suffix)
    { from: "q8", to: "q9", symbol: "1" }, // '111' COMPLETED! → Accept

    { from: "q7", to: "q4", symbol: "0" }, // '1100' fails pattern
    { from: "q7", to: "q9", symbol: "1" }, // '1101' contains '101' → Accept

    // ============================================================
    // LAYER 5: The Tail (1+0*+11)*
    // ============================================================
    { from: "q9", to: "q9", symbol: "0" },
    { from: "q9", to: "q9", symbol: "1" },
  ],
};

export const DFA2: DFA = {
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
  transitions: [
    // ============================================================
    // LAYER 1: (bab)*
    // Handles the optional repeating prefix.
    // q0 is entry; q1/q4/q6 track 'b', 'ba', 'bab'.
    // q6 is an ambiguous checkpoint after a completed 'bab'.
    // ============================================================
    { from: "q0", to: "q1", symbol: "b" }, // Start 'bab' tracker
    { from: "q0", to: "q2", symbol: "a" }, // Exit prefix directly via 'a'

    { from: "q1", to: "q4", symbol: "a" }, // 'b' -> 'ba'
    { from: "q1", to: "q3", symbol: "b" }, // Leave prefix via 'b'

    { from: "q4", to: "q6", symbol: "b" }, // 'ba' -> 'bab' (loop checkpoint)
    { from: "q4", to: "T", symbol: "a" }, // 'baa' is invalid for this stage

    { from: "q6", to: "q1", symbol: "b" }, // continue through another possible prefix branch
    { from: "q6", to: "q10", symbol: "a" }, // IMPORTANT: preserve valid '...bab a ...' handoff

    // ============================================================
    // LAYER 2: (b+a)
    // Mandatory single-symbol choice before the required (bab+aba).
    // q2 handles the 'a' branch; q1/q3 participate in the 'b' side.
    // ============================================================
    { from: "q2", to: "q5", symbol: "a" }, // 'a' -> prepare aba-side
    { from: "q2", to: "q3", symbol: "b" }, // 'a' -> prepare bab-side

    // ============================================================
    // LAYER 3: (bab+aba)
    // Mandatory pattern detector.
    // ============================================================
    { from: "q3", to: "q7", symbol: "a" }, // continue toward required middle pattern
    { from: "q3", to: "T", symbol: "b" }, // bad continuation for this stage

    { from: "q5", to: "q8", symbol: "b" }, // continue toward required middle pattern
    { from: "q5", to: "T", symbol: "a" }, // bad continuation

    { from: "q7", to: "q9", symbol: "b" }, // middle pattern completed
    { from: "q7", to: "T", symbol: "a" }, // bad continuation

    { from: "q8", to: "q10", symbol: "a" }, // middle pattern completed
    { from: "q8", to: "T", symbol: "b" }, // bad continuation

    // q9 and q10 = middle block complete, now move into suffix/tail logic
    { from: "q9", to: "q11", symbol: "a" }, // enter tail scanner
    { from: "q9", to: "q11", symbol: "b" }, // enter tail scanner
    { from: "q10", to: "q11", symbol: "a" }, // enter tail scanner
    { from: "q10", to: "q11", symbol: "b" }, // enter tail scanner

    // ============================================================
    // LAYER 4+: Tail Checker
    // Enforces final ending condition: string must end in aa or bb.
    // q11 starts the tail scan; q14/q15 are accept states.
    // ============================================================
    { from: "q11", to: "q13", symbol: "a" }, // last seen symbol = a
    { from: "q11", to: "q12", symbol: "b" }, // last seen symbol = b

    { from: "q12", to: "q14", symbol: "b" }, // now ends with bb
    { from: "q12", to: "q13", symbol: "a" }, // switched from b to a

    { from: "q13", to: "q15", symbol: "a" }, // now ends with aa
    { from: "q13", to: "q12", symbol: "b" }, // switched from a to b

    { from: "q14", to: "q14", symbol: "b" }, // still ends with bb
    { from: "q14", to: "q13", symbol: "a" }, // bb broken by a

    { from: "q15", to: "q15", symbol: "a" }, // still ends with aa
    { from: "q15", to: "q12", symbol: "b" }, // aa broken by b

    // ============================================================
    // TRAP STATE
    // ============================================================
    { from: "T", to: "T", symbol: "a" },
    { from: "T", to: "T", symbol: "b" },
  ],
};

export const DFA_EXAMPLES = {
  dfa1: DFA1,
  dfa2: DFA2,
};

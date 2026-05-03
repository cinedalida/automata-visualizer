import { DFA } from "../types";

export class DFASimulator {
  private dfa: DFA;
  private currentStateId: string;
  private input: string;
  private currentIndex: number;
  private lastTransitionIdx: number | null = null;

  // ============================================================
  // Track history for debugging and UI replay
  // ============================================================
  private history: {
    stateId: string;
    symbol: string;
    transitionIdx: number | null;
  }[] = [];

  constructor(dfa: DFA, input: string) {
    this.dfa = dfa;
    this.input = input;
    this.currentStateId = dfa.states.find((s) => s.isStart)?.id || "";
    this.currentIndex = 0;

    // ============================================================
    // Validate that the input only contains valid alphabet symbols
    // ============================================================
    for (const ch of input) {
      if (!dfa.alphabet.includes(ch)) {
        console.warn(
          `[DFASimulator] Invalid symbol '${ch}' in input. ` +
            `Expected one of: ${dfa.alphabet.join(", ")}`,
        );
      }
    }
  }

  step(): boolean {
    if (this.isFinished()) return false;

    const symbol = this.input[this.currentIndex];

    // ============================================================
    // Guard against invalid symbols at runtime
    // ============================================================
    if (!this.dfa.alphabet.includes(symbol)) {
      console.error(
        `[DFASimulator] Symbol '${symbol}' at index ${this.currentIndex} ` +
          `is not in alphabet {${this.dfa.alphabet.join(", ")}}`,
      );
      this.currentIndex = this.input.length; // Force finish
      this.lastTransitionIdx = null;
      return false;
    }

    const transIdx = this.dfa.transitions.findIndex(
      (t) => t.from === this.currentStateId && t.symbol === symbol,
    );

    if (transIdx !== -1) {
      const transition = this.dfa.transitions[transIdx];

      // ============================================================
      // Record step in history
      // ============================================================
      this.history.push({
        stateId: this.currentStateId,
        symbol,
        transitionIdx: transIdx,
      });

      this.currentStateId = transition.to;
      this.currentIndex++;
      this.lastTransitionIdx = transIdx;
      return true;
    } else {
      // ============================================================
      // Log missing transition for debugging
      // This should not happen in a complete DFA but helps catch
      // data errors in transitions array
      // ============================================================
      console.error(
        `[DFASimulator] No transition found from '${this.currentStateId}' ` +
          `on symbol '${symbol}'. DFA may be incomplete.`,
      );

      this.history.push({
        stateId: this.currentStateId,
        symbol,
        transitionIdx: null,
      });

      this.currentIndex = this.input.length;
      this.lastTransitionIdx = null;
      return false;
    }
  }

  isFinished(): boolean {
    return this.currentIndex >= this.input.length;
  }

  isAccepted(): boolean {
    const currentState = this.dfa.states.find(
      (s) => s.id === this.currentStateId,
    );
    return this.isFinished() && (currentState?.isAccept || false);
  }

  getCurrentStateId(): string {
    return this.currentStateId;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getLastTransitionIdx(): number | null {
    return this.lastTransitionIdx;
  }

  // ============================================================
  // Get full step history for debugging or UI display
  // ============================================================
  getHistory() {
    return [...this.history];
  }

  // ============================================================
  // Get a human-readable trace string for debugging
  // ============================================================
  getTraceString(): string {
    const startState = this.dfa.states.find((s) => s.isStart)?.id || "??";
    let trace = `[${startState}]`;

    for (const entry of this.history) {
      trace += ` --(${entry.symbol})--> [${
        entry.transitionIdx !== null
          ? this.dfa.transitions[entry.transitionIdx].to
          : "STUCK"
      }]`;
    }

    return trace;
  }

  reset() {
    this.currentStateId = this.dfa.states.find((s) => s.isStart)?.id || "";
    this.currentIndex = 0;
    this.lastTransitionIdx = null;
    this.history = []; // Clear history on reset
  }
}

import { DFA } from '../types';

export class DFASimulator {
  private dfa: DFA;
  private currentStateId: string;
  private input: string;
  private currentIndex: number;
  private lastTransitionIdx: number | null = null;

  constructor(dfa: DFA, input: string) {
    this.dfa = dfa;
    this.input = input;
    this.currentStateId = dfa.states.find(s => s.isStart)?.id || '';
    this.currentIndex = 0;
  }

  step(): boolean {
    if (this.isFinished()) return false;

    const symbol = this.input[this.currentIndex];
    const transIdx = this.dfa.transitions.findIndex(
      t => t.from === this.currentStateId && t.symbol === symbol
    );

    if (transIdx !== -1) {
      const transition = this.dfa.transitions[transIdx];
      this.currentStateId = transition.to;
      this.currentIndex++;
      this.lastTransitionIdx = transIdx;
      return true;
    } else {
      this.currentIndex = this.input.length;
      this.lastTransitionIdx = null;
      return false;
    }
  }

  isFinished(): boolean {
    return this.currentIndex >= this.input.length;
  }

  isAccepted(): boolean {
    const currentState = this.dfa.states.find(s => s.id === this.currentStateId);
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

  reset() {
    this.currentStateId = this.dfa.states.find(s => s.isStart)?.id || '';
    this.currentIndex = 0;
    this.lastTransitionIdx = null;
  }
}

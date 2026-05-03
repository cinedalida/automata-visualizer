import { PDA, PDATransition } from "../types";

interface StackItem {
  id: string;
  symbol: string;
}

interface SearchNode {
  state: string;
  stack: StackItem[];
  inputIdx: number;
  lastTransitionIdx: number | null;
  parent: SearchNode | null;
  historyLog: string;
}

interface SimulationStep {
  stateId: string;
  stack: StackItem[];
  inputIdx: number;
  history: string[];
  lastTransitionIdx: number | null;
}

export class PDASimulator {
  private pda: PDA;
  private input: string;
  private path: SimulationStep[] = [];
  private currentStepIdx: number = 0;
  private idCounter: number = 0;
  private readonly EPSILON = "";

  constructor(pda: PDA, input: string) {
    this.pda = pda;
    this.input = input;

    // ============================================================
    // Validate input symbols against PDA alphabet
    // Warns immediately if an invalid character is found
    // ============================================================
    for (const ch of input) {
      if (!pda.alphabet.includes(ch)) {
        console.warn(
          `[PDASimulator] Invalid symbol '${ch}' in input. ` +
            `Expected one of: ${pda.alphabet.join(", ")}`,
        );
      }
    }

    this.resolvePath();
  }

  private generateId() {
    return `s-${this.idCounter++}`;
  }

  // ============================================================
  // Validate that the PDA data is complete
  // Catches missing transitions or undefined states early
  // ============================================================
  private validatePDA(): string[] {
    const warnings: string[] = [];

    // Check every state has at least one transition
    for (const state of this.pda.states) {
      const hasTransition = this.pda.transitions.some(
        (t) => t.from === state.id,
      );
      if (!hasTransition && !this.pda.acceptStates.includes(state.id)) {
        warnings.push(
          `[PDASimulator] State '${state.id}' has no outgoing transitions and is not an accept state.`,
        );
      }
    }

    // Check every transition references valid states
    for (const t of this.pda.transitions) {
      const fromExists = this.pda.states.some((s) => s.id === t.from);
      const toExists = this.pda.states.some((s) => s.id === t.to);
      if (!fromExists) {
        warnings.push(
          `[PDASimulator] Transition references unknown 'from' state: '${t.from}'`,
        );
      }
      if (!toExists) {
        warnings.push(
          `[PDASimulator] Transition references unknown 'to' state: '${t.to}'`,
        );
      }
    }

    return warnings;
  }

  private resolvePath() {
    this.idCounter = 0;

    // ============================================================
    // Run validation and log warnings before BFS
    // ============================================================
    const warnings = this.validatePDA();
    for (const w of warnings) {
      console.warn(w);
    }

    const startNode: SearchNode = {
      state: this.pda.startState,
      stack: [{ id: this.generateId(), symbol: this.pda.startStackSymbol }],
      inputIdx: 0,
      lastTransitionIdx: null,
      parent: null,
      historyLog: `Start: state=${this.pda.startState}, stack=[${this.pda.startStackSymbol}]`,
    };

    const queue: SearchNode[] = [startNode];
    const visited = new Set<string>();

    // ============================================================
    // Increased maxIterations for longer strings
    // Was 5000, now 50000 to match CFG engine
    // ============================================================
    const maxIterations = 50000;
    let iterations = 0;
    let bestNode: SearchNode = startNode;
    let foundAccepting = false;

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const current = queue.shift()!;

      // ============================================================
      // Accept check: all input consumed and in an accept state
      // ============================================================
      if (
        current.inputIdx === this.input.length &&
        this.pda.acceptStates.includes(current.state)
      ) {
        bestNode = current;
        foundAccepting = true;
        break;
      }

      // ============================================================
      // Track best node seen so far (furthest in input)
      // Used as fallback if no accepting path is found
      // ============================================================
      if (!foundAccepting && current.inputIdx > bestNode.inputIdx) {
        bestNode = current;
      }

      const currentSymbol =
        current.inputIdx < this.input.length
          ? this.input[current.inputIdx]
          : null;
      const topItem = current.stack[current.stack.length - 1];
      const topSymbol = topItem?.symbol || this.EPSILON;

      this.pda.transitions.forEach((t, idx) => {
        const consumesInput = t.input !== this.EPSILON;
        const inputMatches =
          !consumesInput ||
          (currentSymbol !== null && t.input === currentSymbol);
        const readsStack = t.pop !== this.EPSILON;
        const popMatches = !readsStack || t.pop === topSymbol;

        if (t.from === current.state && inputMatches && popMatches) {
          // Deep copy stack to prevent shared references
          const nextStack = current.stack.map((item) => ({ ...item }));

          if (readsStack && nextStack.length > 0) {
            nextStack.pop();
          }

          if (t.push !== this.EPSILON) {
            const symbolsToPush =
              t.push.length > 1 && !this.pda.stackAlphabet.includes(t.push)
                ? t.push.split("").reverse()
                : [t.push];

            for (const s of symbolsToPush) {
              nextStack.push({ id: this.generateId(), symbol: s });
            }
          }

          const nextIdx = consumesInput
            ? current.inputIdx + 1
            : current.inputIdx;
          const nextState = t.to;
          const stateKey = `${nextState}|${nextIdx}|${nextStack.map((i) => i.symbol).join(",")}`;

          if (visited.has(stateKey)) return;
          visited.add(stateKey);

          // ============================================================
          // Richer history log entry with stack snapshot
          // ============================================================
          const stackSnapshot = nextStack.map((i) => i.symbol).join(", ");

          queue.push({
            state: nextState,
            stack: nextStack,
            inputIdx: nextIdx,
            lastTransitionIdx: idx,
            parent: current,
            historyLog:
              `δ(${current.state}, '${t.input || "ε"}') ` +
              `pop='${t.pop || "ε"}' push='${t.push || "ε"}' ` +
              `→ ${nextState} ` +
              `| stack: [${stackSnapshot || "empty"}]`,
          });
        }
      });
    }

    // ============================================================
    // Log if search exhausted without finding accept state
    // ============================================================
    if (!foundAccepting) {
      console.warn(
        `[PDASimulator] No accepting path found for input '${this.input}'. ` +
          `Reached furthest state '${bestNode.state}' at index ${bestNode.inputIdx}/${this.input.length}.`,
      );
    }

    // Reconstruct path from bestNode back to start
    const nodes: SearchNode[] = [];
    let curr: SearchNode | null = bestNode;
    while (curr) {
      nodes.unshift(curr);
      curr = curr.parent;
    }

    this.path = nodes.map((node, i) => ({
      stateId: node.state,
      stack: node.stack.map((item) => ({ ...item })),
      inputIdx: node.inputIdx,
      lastTransitionIdx: node.lastTransitionIdx,
      history: nodes.slice(0, i + 1).map((n) => n.historyLog),
    }));
  }

  hasEpsilonTransition(): boolean {
    if (this.currentStepIdx + 1 < this.path.length) {
      const nextStep = this.path[this.currentStepIdx + 1];
      return (
        this.pda.transitions[nextStep.lastTransitionIdx!]?.input ===
        this.EPSILON
      );
    }
    return false;
  }

  step(): boolean {
    if (this.currentStepIdx < this.path.length - 1) {
      this.currentStepIdx++;
      return true;
    }
    return false;
  }

  // ============================================================
  // Get a human-readable trace string for debugging
  // Same pattern as the updated DFASimulator
  // ============================================================
  getTraceString(): string {
    return this.path
      .map((step, idx) => {
        if (idx === 0) return `[${step.stateId}]`;
        const t =
          step.lastTransitionIdx !== null
            ? this.pda.transitions[step.lastTransitionIdx]
            : null;
        return t
          ? `--(${t.input || "ε"}, ${t.pop || "ε"}→${t.push || "ε"})--> [${step.stateId}]`
          : `--(?)--> [${step.stateId}]`;
      })
      .join(" ");
  }

  // ============================================================
  // Get total step count for UI display
  // ============================================================
  getTotalSteps(): number {
    return this.path.length - 1;
  }

  // ============================================================
  // Get current step number for UI display
  // ============================================================
  getCurrentStep(): number {
    return this.currentStepIdx;
  }

  getCurrentStateId() {
    return this.path[this.currentStepIdx].stateId;
  }

  getStack() {
    return this.path[this.currentStepIdx].stack;
  }

  getCurrentIndex() {
    return this.path[this.currentStepIdx].inputIdx;
  }

  getHistory() {
    return this.path[this.currentStepIdx].history;
  }

  getLastTransitionIdx() {
    return this.path[this.currentStepIdx].lastTransitionIdx;
  }

  isFinished() {
    return this.currentStepIdx >= this.path.length - 1;
  }

  isAccepted() {
    const curr = this.path[this.currentStepIdx];
    return (
      curr.inputIdx === this.input.length &&
      this.pda.acceptStates.includes(curr.stateId)
    );
  }
}

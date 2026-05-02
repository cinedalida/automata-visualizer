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
  private readonly EPSILON = ""; // Standardize epsilon constant[cite: 3]

  constructor(pda: PDA, input: string) {
    this.pda = pda;
    this.input = input;
    this.resolvePath();
  }

  private generateId() {
    return `s-${this.idCounter++}`;
  }

  private resolvePath() {
    this.idCounter = 0;
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
    const maxIterations = 5000;
    let iterations = 0;
    let bestNode: SearchNode = startNode;
    let foundAccepting = false;

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const current = queue.shift()!;

      if (
        current.inputIdx === this.input.length &&
        this.pda.acceptStates.includes(current.state)
      ) {
        bestNode = current;
        foundAccepting = true;
        break;
      }

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
          // Deep copy the stack items to prevent reference shared state[cite: 3]
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

          queue.push({
            state: nextState,
            stack: nextStack,
            inputIdx: nextIdx,
            lastTransitionIdx: idx,
            parent: current,
            historyLog: `Read '${t.input || "ε"}', Pop '${t.pop || "ε"}', Push '${t.push || "ε"}' -> state ${nextState}`,
          });
        }
      });
    }

    const nodes: SearchNode[] = [];
    let curr: SearchNode | null = bestNode;
    while (curr) {
      nodes.unshift(curr);
      curr = curr.parent;
    }

    this.path = nodes.map((node, i) => ({
      stateId: node.state,
      // Create a unique array reference for React's reconciliation[cite: 3]
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

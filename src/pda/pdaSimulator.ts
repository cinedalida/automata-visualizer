import { PDA, PDATransition } from '../types';

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
      historyLog: `Start: state=${this.pda.startState}, stack=[${this.pda.startStackSymbol}]`
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

      // Acceptance check
      if (current.inputIdx === this.input.length && this.pda.acceptStates.includes(current.state)) {
        bestNode = current;
        foundAccepting = true;
        break;
      }

      // Update furthest progress for error visualization
      if (!foundAccepting && current.inputIdx > bestNode.inputIdx) {
        bestNode = current;
      }

      // Try transitions
      const currentSymbol = current.inputIdx < this.input.length ? this.input[current.inputIdx] : null;
      const topItem = current.stack[current.stack.length - 1];
      const topSymbol = topItem?.symbol || '';

      this.pda.transitions.forEach((t, idx) => {
        const inputMatches = t.input === '' || (currentSymbol !== null && t.input === currentSymbol);
        const popMatches = t.pop === '' || t.pop === topSymbol;

        if (t.from === current.state && inputMatches && popMatches) {
          const nextStack = [...current.stack];
          if (t.pop !== '') {
            nextStack.pop();
          }
          if (t.push !== '') {
            const toPush = t.push.split('').reverse();
            for (const s of toPush) {
              nextStack.push({ id: this.generateId(), symbol: s });
            }
          }

          const nextIdx = t.input === '' ? current.inputIdx : current.inputIdx + 1;
          const nextState = t.to;

          // Epsilon loop prevention
          const stackSymbols = nextStack.map(i => i.symbol).join(',');
          const stateKey = `${nextState}|${nextIdx}|${stackSymbols}`;
          if (t.input === '' && visited.has(stateKey)) return;
          if (t.input === '') visited.add(stateKey);

          queue.push({
            state: nextState,
            stack: nextStack,
            inputIdx: nextIdx,
            lastTransitionIdx: idx,
            parent: current,
            historyLog: `Read '${t.input || 'ε'}', Pop '${t.pop || 'ε'}', Push '${t.push || 'ε'}' -> state ${nextState}`
          });
        }
      });
    }

    // Reconstruct path
    const nodes: SearchNode[] = [];
    let curr: SearchNode | null = bestNode;
    while (curr) {
      nodes.unshift(curr);
      curr = curr.parent;
    }

    this.path = nodes.map((node, i) => ({
      stateId: node.state,
      stack: node.stack,
      inputIdx: node.inputIdx,
      lastTransitionIdx: node.lastTransitionIdx,
      history: nodes.slice(0, i + 1).map(n => n.historyLog)
    }));
    this.currentStepIdx = 0;
  }

  step(): boolean {
    if (this.currentStepIdx < this.path.length - 1) {
      this.currentStepIdx++;
      return true;
    }
    return false;
  }

  getCurrentStateId(): string {
    return this.path[this.currentStepIdx].stateId;
  }

  getStack(): StackItem[] {
    return [...this.path[this.currentStepIdx].stack];
  }

  getCurrentIndex(): number {
    return this.path[this.currentStepIdx].inputIdx;
  }

  getHistory(): string[] {
    return this.path[this.currentStepIdx].history;
  }

  getLastTransitionIdx(): number | null {
    return this.path[this.currentStepIdx].lastTransitionIdx;
  }

  isFinished(): boolean {
    return this.currentStepIdx >= this.path.length - 1;
  }

  isAccepted(): boolean {
    const current = this.path[this.currentStepIdx];
    return current.inputIdx === this.input.length && this.pda.acceptStates.includes(current.stateId);
  }

  hasEpsilonTransition(): boolean {
    return false; 
  }

  reset() {
    this.currentStepIdx = 0;
  }
}

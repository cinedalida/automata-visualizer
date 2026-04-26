import { CFG } from '../types';

export interface DerivationResult {
  steps: string[];
  isAccepted: boolean;
}

export class CFGEngine {
  private cfg: CFG;

  constructor(cfg: CFG) {
    this.cfg = {
      ...cfg,
      variables: [...cfg.variables].sort((a, b) => b.length - a.length)
    };
  }

  validate(input: string): DerivationResult {
    // Basic BFS to find derivation. Limit depth to avoid infinite loops with ε-productions or recursion.
    const queue: { sentential: string; derivation: string[] }[] = [
      { sentential: this.cfg.startSymbol, derivation: [this.cfg.startSymbol] }
    ];
    const visited = new Set<string>();
    const maxSteps = 10000;
    let stepsCount = 0;

    while (queue.length > 0 && stepsCount < maxSteps) {
      stepsCount++;
      const current = queue.shift()!;

      if (current.sentential === input) {
        return { steps: current.derivation, isAccepted: true };
      }

      // Find leftmost variable
      let firstVarIdx = -1;
      let firstVar = '';
      
      for (let i = 0; i < current.sentential.length; i++) {
        // Variables are sorted by length DESC in constructor
        for (const v of this.cfg.variables) {
          if (current.sentential.startsWith(v, i)) {
            firstVarIdx = i;
            firstVar = v;
            break;
          }
        }
        if (firstVarIdx !== -1) break;
      }
      
      if (firstVarIdx === -1) continue; // Only terminals and not matching input

      // PRUNING: If the terminal prefix before the first variable doesn't match the input
      const prefix = current.sentential.slice(0, firstVarIdx);
      if (!input.startsWith(prefix)) continue;

      // PRUNING: If sentential is already much longer than input (heuristic)
      // Usually sentential length is terminals + 1.
      if (current.sentential.length > input.length + 10) continue;

      const productions = this.cfg.productions[firstVar] || [];
      for (const prod of productions) {
        const nextSentential = 
          current.sentential.slice(0, firstVarIdx) + 
          (prod === 'ε' ? '' : prod) + 
          current.sentential.slice(firstVarIdx + firstVar.length);
          
        if (!visited.has(nextSentential)) {
          visited.add(nextSentential);
          queue.push({
            sentential: nextSentential,
            derivation: [...current.derivation, nextSentential]
          });
        }
      }
    }

    return { steps: [], isAccepted: false };
  }
}

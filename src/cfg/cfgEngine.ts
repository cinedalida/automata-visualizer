import { CFG } from "../types";

export interface DerivationResult {
  steps: string[];
  isAccepted: boolean;
}

export class CFGEngine {
  private cfg: CFG;
  private sortedVariables: string[];

  constructor(cfg: CFG) {
    this.cfg = cfg;
    // Sort variables by length DESC so longer names match first
    // This prevents 'q1' from matching inside 'q10', 'q11', etc.
    this.sortedVariables = [...cfg.variables].sort(
      (a, b) => b.length - a.length,
    );
  }

  // ============================================================
  // Check if a character at position i is part of a variable
  // ============================================================
  private findLeftmostVariable(
    sentential: string,
  ): { index: number; variable: string } | null {
    for (let i = 0; i < sentential.length; i++) {
      for (const v of this.sortedVariables) {
        if (sentential.startsWith(v, i)) {
          return { index: i, variable: v };
        }
      }
    }
    return null;
  }

  // ============================================================
  // Check if sentential form is all terminals (no variables left)
  // ============================================================
  private isAllTerminals(sentential: string): boolean {
    return this.findLeftmostVariable(sentential) === null;
  }

  // ============================================================
  // Apply a production: replace variable at given index
  // ============================================================
  private applyProduction(
    sentential: string,
    varIndex: number,
    variable: string,
    production: string,
  ): string {
    const before = sentential.slice(0, varIndex);
    const after = sentential.slice(varIndex + variable.length);

    // Handle epsilon: both '' and 'ε' are treated as empty
    const replacement =
      production === "ε" || production === "" ? "" : production;

    return before + replacement + after;
  }

  // ============================================================
  // Count terminals in sentential form (ignoring variables)
  // Used for smarter pruning
  // ============================================================
  private countTerminals(sentential: string): number {
    let count = 0;
    let i = 0;

    while (i < sentential.length) {
      let isVariable = false;

      for (const v of this.sortedVariables) {
        if (sentential.startsWith(v, i)) {
          i += v.length;
          isVariable = true;
          break;
        }
      }

      if (!isVariable) {
        count++;
        i++;
      }
    }

    return count;
  }

  // ============================================================
  // Extract terminal prefix (before the first variable)
  // ============================================================
  private getTerminalPrefix(sentential: string): string {
    const result = this.findLeftmostVariable(sentential);
    if (result === null) return sentential;
    return sentential.slice(0, result.index);
  }

  // ============================================================
  // Main validation: BFS leftmost derivation
  // ============================================================
  validate(input: string): DerivationResult {
    const queue: { sentential: string; derivation: string[] }[] = [
      {
        sentential: this.cfg.startSymbol,
        derivation: [this.cfg.startSymbol],
      },
    ];

    const visited = new Set<string>();
    visited.add(this.cfg.startSymbol);

    const maxSteps = 50000;
    let stepsCount = 0;

    while (queue.length > 0 && stepsCount < maxSteps) {
      stepsCount++;
      const current = queue.shift()!;

      // --------------------------------------------------------
      // Check: did we reach the target string?
      // --------------------------------------------------------
      if (current.sentential === input) {
        return {
          steps: current.derivation,
          isAccepted: true,
        };
      }

      // --------------------------------------------------------
      // Find the leftmost variable to expand
      // --------------------------------------------------------
      const leftmost = this.findLeftmostVariable(current.sentential);

      // No variables left but didn't match input → dead end
      if (leftmost === null) continue;

      const { index: varIndex, variable: varName } = leftmost;

      // --------------------------------------------------------
      // PRUNING 1: Terminal prefix must match input prefix
      // If the terminals before the first variable don't match
      // the beginning of the input, this path is already wrong.
      // --------------------------------------------------------
      const terminalPrefix = current.sentential.slice(0, varIndex);
      if (!input.startsWith(terminalPrefix)) continue;

      // --------------------------------------------------------
      // PRUNING 2: Terminal count must not exceed input length
      // If we already have more terminal symbols than the input
      // has characters, no production can fix that.
      // --------------------------------------------------------
      const terminalCount = this.countTerminals(current.sentential);
      if (terminalCount > input.length) continue;

      // --------------------------------------------------------
      // PRUNING 3: Overall length sanity check
      // Sentential form shouldn't grow absurdly large.
      // Allow some slack for variable names being multi-char.
      // --------------------------------------------------------
      const maxLength =
        input.length + (this.sortedVariables[0]?.length || 2) * 5;
      if (current.sentential.length > maxLength) continue;

      // --------------------------------------------------------
      // Try all productions for this variable
      // --------------------------------------------------------
      const productions = this.cfg.productions[varName] || [];

      for (const prod of productions) {
        const nextSentential = this.applyProduction(
          current.sentential,
          varIndex,
          varName,
          prod,
        );

        if (!visited.has(nextSentential)) {
          visited.add(nextSentential);

          // --------------------------------------------------------
          // PRUNING 4: After applying the production, re-check
          // that the new terminal prefix still matches the input.
          // This catches bad expansions immediately.
          // --------------------------------------------------------
          const newPrefix = this.getTerminalPrefix(nextSentential);
          if (!input.startsWith(newPrefix)) continue;

          // --------------------------------------------------------
          // PRUNING 5: If the result is all terminals but doesn't
          // match input, skip it immediately (don't even enqueue).
          // --------------------------------------------------------
          if (this.isAllTerminals(nextSentential)) {
            if (nextSentential === input) {
              return {
                steps: [...current.derivation, nextSentential],
                isAccepted: true,
              };
            }
            // All terminals but wrong string → dead end
            continue;
          }

          queue.push({
            sentential: nextSentential,
            derivation: [...current.derivation, nextSentential],
          });
        }
      }
    }

    // --------------------------------------------------------
    // Exhausted search or hit step limit → reject
    // --------------------------------------------------------
    return {
      steps: [],
      isAccepted: false,
    };
  }
}

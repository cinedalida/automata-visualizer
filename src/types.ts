
export interface Point {
  x: number;
  y: number;
}

export interface State {
  id: string;
  label: string;
  x?: number;
  y?: number;
  isAccept: boolean;
  isStart: boolean;
}

export interface Transition {
  from: string;
  to: string;
  symbol: string;
}

export interface DFA {
  states: State[];
  transitions: Transition[];
  alphabet: string[];
}

export interface PDAState extends State {}

export interface PDATransition {
  from: string;
  to: string;
  input: string; // ε can be represented as ''
  pop: string;   // ε can be represented as ''
  push: string;  // ε can be represented as ''
}

export interface PDA {
  states: PDAState[];
  transitions: PDATransition[];
  alphabet: string[];
  stackAlphabet: string[];
  startState: string;
  startStackSymbol: string;
  acceptStates: string[];
}

export interface CFG {
  variables: string[];
  terminals: string[];
  startSymbol: string;
  productions: Record<string, string[]>;
}

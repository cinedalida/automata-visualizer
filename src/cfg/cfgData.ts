import { CFG } from '../types';

export const CFG_EXAMPLES: Record<string, CFG> = {
  cfg1: {
    variables: ['Q0', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9'],
    terminals: ['0', '1'],
    startSymbol: 'Q0',
    productions: {
      'Q0': ['1Q1', '0Q2'],
      'Q1': ['0Q2', '1Q3'],
      'Q2': ['1Q1', '0Q3'],
      'Q3': ['0Q4', '1Q4'],
      'Q4': ['0Q3', '1Q5'],
      'Q5': ['0Q6', '1Q8'],
      'Q6': ['0Q4', '1Q9'],
      'Q7': ['0Q4', '1Q9'],
      'Q8': ['0Q7', '1Q9'],
      'Q9': ['0Q9', '1Q9', '']
    }
  },
  cfg2: {
    variables: ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'T'],
    terminals: ['a', 'b'],
    startSymbol: 'q0',
    productions: {
      "q0": ["aq2", "bq1"],
      "q1": ["aq4", "bq3"],
      "q2": ["bq3", "aq5"],
      "q3": ["aq7", "bT"],
      "q4": ["aq5", "bq6"],
      "q5": ["aT", "bq8"],
      "q6": ["aq10", "bq1"],
      "q7": ["bq9", "aT"],
      "q8": ["aq10", "bT"],
      "q9": ["aq11", "bq11"],
      "q10": ["aq11", "bq11"],
      "q11": ["bq12", "aq13"],
      "q12": ["bq14", "aq13"],
      "q13": ["bq12", "aq15"],
      "q14": ["aq13", "bq14", ""],
      "q15": ["aq15", "bq12", ""],
      "T": ["aT", "bT"]
    }
  }
};

export interface Quote {
  text: string;
  source?: string;
}

export interface MathProblem {
  num1: number;
  num2: number;
  answer: number;
}

export enum AppState {
  INTRO = 'INTRO',
  LOADING = 'LOADING',
  CHALLENGE = 'CHALLENGE',
  REVEAL = 'REVEAL'
}
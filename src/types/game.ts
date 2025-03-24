
export type GameStatus = 'start' | 'playing' | 'end';
export type GameType = 'spelling' | 'multiplication';

export type Challenge = {
  id: number;
  word: string;
  options: string[];
  correctOption: string;
  prefix: string;
  suffix: string;
};

export type MultiplicationChallenge = {
  id: number;
  firstNumber: number;
  secondNumber: number;
  correctAnswer: number;
  options: number[];
};

// Track consecutive correct answers for the multiplication game
export type StreakInfo = {
  currentStreak: number;
  showCongratulations: boolean;
  congratulationMessage: string;
};

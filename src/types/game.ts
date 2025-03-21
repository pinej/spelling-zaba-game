
export type GameStatus = 'start' | 'playing' | 'end';

export type Challenge = {
  id: number;
  word: string;
  options: string[];
  correctOption: string;
  prefix: string;
  suffix: string;
};

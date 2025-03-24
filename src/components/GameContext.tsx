
import React, { createContext, useContext, ReactNode } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GameStatus, Challenge, GameType, MultiplicationChallenge, StreakInfo } from '../types/game';

type GameContextType = {
  gameStatus: GameStatus;
  gameType: GameType;
  setGameStatus: (status: GameStatus) => void;
  setGameType: (type: GameType) => void;
  score: number;
  incrementScore: () => void;
  currentRound: number;
  challenges: Challenge[];
  multiplicationChallenges: MultiplicationChallenge[];
  currentChallenge: Challenge | null;
  currentMultiplicationChallenge: MultiplicationChallenge | null;
  totalRounds: number;
  resetGame: () => void;
  goToNextChallenge: () => void;
  playSound: (type: 'correct' | 'incorrect' | 'start' | 'end') => void;
  incorrectAnswers: Challenge[];
  incorrectMultiplicationAnswers: MultiplicationChallenge[];
  addIncorrectAnswer: (challenge: Challenge) => void;
  addIncorrectMultiplicationAnswer: (challenge: MultiplicationChallenge) => void;
  soundsEnabled: boolean;
  enableSounds: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  streak: StreakInfo;
  updateStreak: (correct: boolean) => void;
  resetStreak: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Use our custom hook for game state management
  const gameState = useGameState();

  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
};

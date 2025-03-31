
import React, { createContext, useContext, ReactNode } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GameStatus, Challenge } from '../types/game';

type GameContextType = {
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;
  score: number;
  incrementScore: () => void;
  currentRound: number;
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  totalRounds: number;
  resetGame: () => void;
  goToNextChallenge: () => void;
  playSound: (type: 'correct' | 'incorrect' | 'start' | 'end') => void;
  incorrectAnswers: Challenge[];
  addIncorrectAnswer: (challenge: Challenge) => void;
  soundsEnabled: boolean;
  enableSounds: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  playerName: string;
  setPlayerName: (name: string) => void;
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

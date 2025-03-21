
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateChallenges } from '../utils/gameUtils';
import { useAudio } from '../hooks/useAudio';
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
  const [gameStatus, setGameStatus] = useState<GameStatus>('start');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Challenge[]>([]);
  const { playSound, soundsEnabled, enableSounds } = useAudio();
  
  const totalRounds = 10;

  const resetGame = () => {
    setScore(0);
    setCurrentRound(0);
    setChallenges(generateChallenges());
    setIncorrectAnswers([]);
    setGameStatus('playing');
    playSound('start');
  };

  const incrementScore = () => {
    setScore(prev => prev + 1);
  };

  const addIncorrectAnswer = (challenge: Challenge) => {
    setIncorrectAnswers(prev => [...prev, challenge]);
  };

  const goToNextChallenge = () => {
    if (currentRound + 1 >= totalRounds) {
      setGameStatus('end');
      playSound('end');
    } else {
      setCurrentRound(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (gameStatus === 'playing' && challenges.length === 0) {
      setChallenges(generateChallenges());
    }
  }, [gameStatus]);

  // Get current challenge
  const currentChallenge = challenges[currentRound] || null;

  const value = {
    gameStatus,
    setGameStatus,
    score,
    incrementScore,
    currentRound,
    challenges,
    currentChallenge,
    totalRounds,
    resetGame,
    goToNextChallenge,
    playSound,
    incorrectAnswers,
    addIncorrectAnswer,
    soundsEnabled,
    enableSounds
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

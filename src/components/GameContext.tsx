
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateChallenges } from '../utils/gameUtils';

export type GameStatus = 'start' | 'playing' | 'end';
export type Challenge = {
  id: number;
  word: string;
  options: string[];
  correctOption: string;
  prefix: string;
  suffix: string;
};

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
  const [sounds, setSounds] = useState<Record<string, HTMLAudioElement | null>>({
    correct: null,
    incorrect: null,
    start: null,
    end: null,
  });
  
  const totalRounds = 10;

  // Initialize sounds
  useEffect(() => {
    const correctSound = new Audio('/correct.mp3');
    const incorrectSound = new Audio('/incorrect.mp3');
    const startSound = new Audio('/start.mp3');
    const endSound = new Audio('/end.mp3');

    setSounds({
      correct: correctSound,
      incorrect: incorrectSound,
      start: startSound,
      end: endSound,
    });

    // Preload sounds
    correctSound.load();
    incorrectSound.load();
    startSound.load();
    endSound.load();

    return () => {
      // Clean up
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
    };
  }, []);

  const playSound = (type: 'correct' | 'incorrect' | 'start' | 'end') => {
    const sound = sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.error('Error playing sound:', e));
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentRound(0);
    setChallenges(generateChallenges());
    setGameStatus('playing');
    playSound('start');
  };

  const incrementScore = () => {
    setScore(prev => prev + 1);
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
    playSound
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

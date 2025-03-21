
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
  incorrectAnswers: Challenge[];
  addIncorrectAnswer: (challenge: Challenge) => void;
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

// Define sound file paths
const SOUND_PATHS = {
  correct: '/correct.mp3',
  incorrect: '/incorrect.mp3',
  start: '/start.mp3',
  end: '/end.mp3'
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('start');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Challenge[]>([]);
  const [sounds, setSounds] = useState<Record<string, HTMLAudioElement | null>>({
    correct: null,
    incorrect: null,
    start: null,
    end: null,
  });
  
  const totalRounds = 10;

  // Create and preload audio elements
  useEffect(() => {
    const audioElements: Record<string, HTMLAudioElement> = {
      correct: new Audio(SOUND_PATHS.correct),
      incorrect: new Audio(SOUND_PATHS.incorrect),
      start: new Audio(SOUND_PATHS.start),
      end: new Audio(SOUND_PATHS.end)
    };
    
    // Set volume for all sounds (increase volume to 1.0)
    Object.values(audioElements).forEach(audio => {
      audio.volume = 1.0;
      
      // Force preload
      audio.preload = 'auto';
      
      // Optional: add event listeners to verify loading
      audio.addEventListener('canplaythrough', () => {
        console.log(`Sound loaded: ${audio.src}`);
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`Error loading sound: ${audio.src}`, e);
      });
      
      // Start loading
      try {
        audio.load();
      } catch (err) {
        console.error('Error loading audio:', err);
      }
    });
    
    setSounds(audioElements);
    
    return () => {
      // Clean up
      Object.values(audioElements).forEach(sound => {
        sound.pause();
        sound.src = '';
      });
    };
  }, []);

  const playSound = (type: 'correct' | 'incorrect' | 'start' | 'end') => {
    const sound = sounds[type];
    if (sound) {
      console.log(`Playing sound: ${type} from ${sound.src}`);
      // Reset to beginning and ensure volume is up
      sound.currentTime = 0;
      sound.volume = 1.0;
      
      // Use try/catch to handle play errors
      try {
        const playPromise = sound.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error(`Error playing sound: ${e.message}`);
            // Attempt to reload the sound if there was an error
            sound.load();
          });
        }
      } catch (e) {
        console.error('Error playing sound:', e);
      }
    } else {
      console.warn(`Sound not loaded for type: ${type}`);
    }
  };

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
    addIncorrectAnswer
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

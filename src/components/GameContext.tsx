
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

// Define sound file paths with proper references
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
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const totalRounds = 10;

  // Create and enable audio only after user interaction
  useEffect(() => {
    // Create a user interaction handler to enable audio
    const enableAudio = () => {
      console.log("User interaction detected - enabling audio");
      
      const audioElements: Record<string, HTMLAudioElement> = {
        correct: new Audio(SOUND_PATHS.correct),
        incorrect: new Audio(SOUND_PATHS.incorrect),
        start: new Audio(SOUND_PATHS.start),
        end: new Audio(SOUND_PATHS.end)
      };
      
      // Set volume and preload for all sounds
      Object.values(audioElements).forEach(audio => {
        audio.volume = 1.0;
        audio.muted = false;
        audio.preload = 'auto';
        
        // Force a load attempt
        audio.load();
        
        // Add event listeners to verify loading
        audio.addEventListener('canplaythrough', () => {
          console.log(`Sound loaded: ${audio.src}`);
        });
        
        audio.addEventListener('error', (e) => {
          console.error(`Error loading sound: ${audio.src}`, e);
        });
        
        // Test playback and immediately pause (to enable audio context)
        const testPlay = audio.play().catch(err => {
          console.warn("Initial audio test play failed:", err.message);
        });
        
        if (testPlay !== undefined) {
          testPlay.then(() => {
            audio.pause();
            audio.currentTime = 0;
            console.log(`Audio successfully initialized: ${audio.src}`);
          });
        }
      });
      
      setSounds(audioElements);
      setAudioInitialized(true);
      
      // Remove the event listeners once audio is enabled
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
    
    // Add event listeners for user interaction
    window.addEventListener('click', enableAudio);
    window.addEventListener('touchstart', enableAudio);
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      
      // Clean up audio elements
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.src = '';
        }
      });
    };
  }, []);

  const playSound = (type: 'correct' | 'incorrect' | 'start' | 'end') => {
    const sound = sounds[type];
    
    if (!sound) {
      console.warn(`Sound not loaded for type: ${type}`);
      return;
    }
    
    console.log(`Attempting to play sound: ${type} from ${sound.src}`);
    
    // Reset to beginning and ensure volume is up
    sound.currentTime = 0;
    sound.volume = 1.0;
    sound.muted = false;
    
    try {
      // Create a new AudioContext to help with browser policies
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      }
      
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Sound playing successfully: ${type}`);
          })
          .catch(e => {
            console.error(`Error playing sound: ${e.message}`);
            
            // If there's an autoplay policy issue, attach a temporary click handler
            if (e.name === 'NotAllowedError') {
              console.log("Creating temporary click handler to enable audio");
              
              const tempHandler = () => {
                sound.play().catch(err => console.error("Still could not play sound:", err));
                document.removeEventListener('click', tempHandler);
                document.removeEventListener('touchstart', tempHandler);
              };
              
              document.addEventListener('click', tempHandler);
              document.addEventListener('touchstart', tempHandler);
            }
          });
      }
    } catch (e) {
      console.error('Critical error playing sound:', e);
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

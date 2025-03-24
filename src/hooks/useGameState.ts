
import { useState, useEffect } from 'react';
import { generateChallenges } from '../utils/gameUtils';
import { generateMultiplicationChallenges } from '../utils/multiplicationUtils';
import { GameStatus, Challenge, GameType, MultiplicationChallenge, StreakInfo } from '../types/game';
import { useAudio } from './useAudio';

export function useGameState() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('start');
  const [gameType, setGameType] = useState<GameType>('spelling');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [multiplicationChallenges, setMultiplicationChallenges] = useState<MultiplicationChallenge[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Challenge[]>([]);
  const [incorrectMultiplicationAnswers, setIncorrectMultiplicationAnswers] = useState<MultiplicationChallenge[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const { playSound, soundsEnabled, enableSounds, isMuted, toggleMute } = useAudio();
  
  // Track streak for showing congratulation messages
  const [streak, setStreak] = useState<StreakInfo>({
    currentStreak: 0,
    showCongratulations: false,
    congratulationMessage: ''
  });
  
  const totalRounds = 10;

  const resetGame = () => {
    setScore(0);
    setCurrentRound(0);
    
    if (gameType === 'spelling') {
      setChallenges(generateChallenges());
    } else {
      setMultiplicationChallenges(generateMultiplicationChallenges());
    }
    
    setIncorrectAnswers([]);
    setIncorrectMultiplicationAnswers([]);
    resetStreak();
    setGameStatus('playing');
    playSound('start');
  };

  const incrementScore = () => {
    setScore(prev => prev + 1);
  };

  const addIncorrectAnswer = (challenge: Challenge) => {
    setIncorrectAnswers(prev => [...prev, challenge]);
  };

  const addIncorrectMultiplicationAnswer = (challenge: MultiplicationChallenge) => {
    setIncorrectMultiplicationAnswers(prev => [...prev, challenge]);
  };

  const updateStreak = (correct: boolean) => {
    if (correct) {
      const newStreakCount = streak.currentStreak + 1;
      
      let showCongrats = false;
      let message = '';
      
      if (newStreakCount === 3) {
        showCongrats = true;
        message = "Świetnie Ci idzie!";
      } else if (newStreakCount === 10) {
        showCongrats = true;
        message = "Wow - mistrzowski wynik!";
      }
      
      setStreak({
        currentStreak: newStreakCount,
        showCongratulations: showCongrats,
        congratulationMessage: message
      });
    } else {
      // Reset streak on incorrect answer
      resetStreak();
    }
  };

  const resetStreak = () => {
    setStreak({
      currentStreak: 0,
      showCongratulations: false,
      congratulationMessage: ''
    });
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
    if (gameStatus === 'playing') {
      if (gameType === 'spelling' && challenges.length === 0) {
        setChallenges(generateChallenges());
      } else if (gameType === 'multiplication' && multiplicationChallenges.length === 0) {
        setMultiplicationChallenges(generateMultiplicationChallenges());
      }
    }
  }, [gameStatus, gameType]);

  // Get current challenge based on game type
  const currentChallenge = gameType === 'spelling' ? challenges[currentRound] || null : null;
  const currentMultiplicationChallenge = gameType === 'multiplication' ? multiplicationChallenges[currentRound] || null : null;

  return {
    gameStatus,
    setGameStatus,
    gameType,
    setGameType,
    score,
    incrementScore,
    currentRound,
    challenges,
    multiplicationChallenges,
    currentChallenge,
    currentMultiplicationChallenge,
    totalRounds,
    resetGame,
    goToNextChallenge,
    playSound,
    incorrectAnswers,
    incorrectMultiplicationAnswers,
    addIncorrectAnswer,
    addIncorrectMultiplicationAnswer,
    soundsEnabled,
    enableSounds,
    isMuted,
    toggleMute,
    playerName,
    setPlayerName,
    streak,
    updateStreak,
    resetStreak
  };
}

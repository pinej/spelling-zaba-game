
import { useState, useEffect } from 'react';
import { generateChallenges } from '../utils/gameUtils';
import { GameStatus, Challenge } from '../types/game';
import { useAudio } from './useAudio';

export function useGameState() {
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

  return {
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
}

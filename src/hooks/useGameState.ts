
import { useState, useEffect } from 'react';
import { GameStatus, GameType, Challenge, MultiplicationChallenge } from '../types/game';
import { useAudio } from './useAudio';
import { useStreak } from './useStreak';
import { useChallenges } from './useChallenges';

export function useGameState() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('start');
  const [gameType, setGameType] = useState<GameType>('spelling');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerName, setPlayerName] = useState<string>('');
  
  const { playSound, soundsEnabled, enableSounds, isMuted, toggleMute } = useAudio();
  const { streak, updateStreak, resetStreak } = useStreak();
  const { 
    challenges, 
    multiplicationChallenges, 
    incorrectAnswers, 
    incorrectMultiplicationAnswers,
    generateGameChallenges,
    addIncorrectAnswer,
    addIncorrectMultiplicationAnswer,
    resetChallenges
  } = useChallenges();
  
  const totalRounds = 10;

  const resetGame = () => {
    setScore(0);
    setCurrentRound(0);
    
    generateGameChallenges(gameType);
    resetChallenges();
    resetStreak();
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
    if (gameStatus === 'playing') {
      generateGameChallenges(gameType);
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

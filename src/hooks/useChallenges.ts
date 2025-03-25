
import { useState } from 'react';
import { Challenge, MultiplicationChallenge, GameType } from '../types/game';
import { generateChallenges } from '../utils/gameUtils';
import { generateMultiplicationChallenges } from '../utils/multiplicationUtils';

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [multiplicationChallenges, setMultiplicationChallenges] = useState<MultiplicationChallenge[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Challenge[]>([]);
  const [incorrectMultiplicationAnswers, setIncorrectMultiplicationAnswers] = useState<MultiplicationChallenge[]>([]);
  
  const generateGameChallenges = (gameType: GameType) => {
    if (gameType === 'spelling') {
      setChallenges(generateChallenges());
    } else {
      setMultiplicationChallenges(generateMultiplicationChallenges());
    }
  };

  const addIncorrectAnswer = (challenge: Challenge) => {
    setIncorrectAnswers(prev => [...prev, challenge]);
  };

  const addIncorrectMultiplicationAnswer = (challenge: MultiplicationChallenge) => {
    setIncorrectMultiplicationAnswers(prev => [...prev, challenge]);
  };

  const resetChallenges = () => {
    setIncorrectAnswers([]);
    setIncorrectMultiplicationAnswers([]);
  };

  return {
    challenges,
    multiplicationChallenges,
    incorrectAnswers,
    incorrectMultiplicationAnswers,
    generateGameChallenges,
    addIncorrectAnswer,
    addIncorrectMultiplicationAnswer,
    resetChallenges
  };
}

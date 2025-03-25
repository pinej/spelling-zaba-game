
import React, { useEffect } from 'react';
import { useGameContext } from '../components/GameContext';
import { useNavigate } from 'react-router-dom';
import MultiplicationChallengeComponent from '../components/MultiplicationChallengeComponent';
import GameLayout from '../components/GameLayout';

const MultiplicationGame: React.FC = () => {
  const {
    score,
    currentRound,
    totalRounds,
    currentMultiplicationChallenge,
    incrementScore,
    addIncorrectMultiplicationAnswer,
    goToNextChallenge,
    playSound,
    updateStreak,
    streak,
    resetGame,
    setGameType
  } = useGameContext();
  
  const navigate = useNavigate();
  
  // Set game type on component mount
  useEffect(() => {
    setGameType('multiplication');
    resetGame();
  }, []);
  
  const handleAnswer = (selectedAnswer: number) => {
    if (!currentMultiplicationChallenge) return;
    
    const isCorrect = selectedAnswer === currentMultiplicationChallenge.correctAnswer;

    if (isCorrect) {
      incrementScore();
      playSound('correct');
    } else {
      addIncorrectMultiplicationAnswer(currentMultiplicationChallenge);
      playSound('incorrect');
    }

    updateStreak(isCorrect);
    goToNextChallenge();
    
    // Check if game is finished
    if (currentRound + 1 >= totalRounds) {
      navigate('/game');
    }
  };

  if (!currentMultiplicationChallenge) {
    return <div>Ładowanie...</div>;
  }

  return (
    <GameLayout
      score={score}
      currentRound={currentRound}
      totalRounds={totalRounds}
      streak={streak}
      onReset={resetGame}
    >
      <MultiplicationChallengeComponent challenge={currentMultiplicationChallenge} onAnswer={handleAnswer} />
    </GameLayout>
  );
};

export default MultiplicationGame;


import React, { useEffect } from 'react';
import { useGameContext } from '../components/GameContext';
import { useNavigate } from 'react-router-dom';
import ChallengeComponent from '../components/ChallengeComponent';
import GameLayout from '../components/GameLayout';

const SpellingGame: React.FC = () => {
  const {
    score,
    currentRound,
    totalRounds,
    currentChallenge,
    incrementScore,
    addIncorrectAnswer,
    goToNextChallenge,
    playSound,
    updateStreak,
    streak,
    resetGame,
    setGameType,
  } = useGameContext();
  
  const navigate = useNavigate();
  
  // Set game type on component mount
  useEffect(() => {
    setGameType('spelling');
    resetGame();
  }, []);
  
  const handleAnswer = (selectedAnswer: string) => {
    if (!currentChallenge) return;
    
    const isCorrect = selectedAnswer === currentChallenge.correctOption;

    if (isCorrect) {
      incrementScore();
      playSound('correct');
    } else {
      addIncorrectAnswer(currentChallenge);
      playSound('incorrect');
    }

    updateStreak(isCorrect);
    goToNextChallenge();
    
    // Check if game is finished
    if (currentRound + 1 >= totalRounds) {
      navigate('/game');
    }
  };

  if (!currentChallenge) {
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
      <ChallengeComponent challenge={currentChallenge} onAnswer={handleAnswer} />
    </GameLayout>
  );
};

export default SpellingGame;

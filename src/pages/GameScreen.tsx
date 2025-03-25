
import React, { useEffect } from 'react';
import { useGameContext } from '../components/GameContext';
import { useNavigate } from 'react-router-dom';
import ChallengeComponent from '../components/ChallengeComponent';
import MultiplicationChallengeComponent from '../components/MultiplicationChallengeComponent';
import GameLayout from '../components/GameLayout';

const GameScreen: React.FC = () => {
  const {
    gameStatus,
    gameType,
    score,
    currentRound,
    currentChallenge,
    currentMultiplicationChallenge,
    totalRounds,
    resetGame,
    goToNextChallenge,
    incrementScore,
    addIncorrectAnswer,
    addIncorrectMultiplicationAnswer,
    playSound,
    updateStreak,
    streak
  } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameStatus !== 'playing') {
      navigate('/'); // Redirect to home if gameStatus is not 'playing'
    }
  }, [gameStatus, navigate]);

  const handleAnswer = (selectedAnswer: string | number) => {
    let isCorrect = false;

    if (gameType === 'spelling' && currentChallenge) {
      isCorrect = selectedAnswer === currentChallenge.correctOption;

      if (isCorrect) {
        incrementScore();
        playSound('correct');
      } else {
        addIncorrectAnswer(currentChallenge);
        playSound('incorrect');
      }
    } else if (gameType === 'multiplication' && currentMultiplicationChallenge) {
      isCorrect = selectedAnswer === currentMultiplicationChallenge.correctAnswer;

      if (isCorrect) {
        incrementScore();
        playSound('correct');
      } else {
        addIncorrectMultiplicationAnswer(currentMultiplicationChallenge);
        playSound('incorrect');
      }
    }

    updateStreak(isCorrect);
    goToNextChallenge();
  };

  if (!currentChallenge && !currentMultiplicationChallenge) {
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
      {gameType === 'spelling' && currentChallenge && (
        <ChallengeComponent challenge={currentChallenge} onAnswer={handleAnswer} />
      )}
      {gameType === 'multiplication' && currentMultiplicationChallenge && (
        <MultiplicationChallengeComponent challenge={currentMultiplicationChallenge} onAnswer={handleAnswer} />
      )}
    </GameLayout>
  );
};

export default GameScreen;

import React, { useEffect } from 'react';
import { useGameContext } from '../components/GameContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Confetti } from 'lucide-react';
import { motion } from 'framer-motion';
import ChallengeComponent from '../components/ChallengeComponent';
import MultiplicationChallengeComponent from '../components/MultiplicationChallengeComponent';

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
    incorrectAnswers,
    incorrectMultiplicationAnswers,
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
      isCorrect = selectedAnswer === currentChallenge.correctAnswer;

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
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {streak.showCongratulations && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary/20 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <Confetti className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-2xl font-bold text-primary-foreground mb-2">{streak.congratulationMessage}</h2>
          </div>
        </motion.div>
      )}

      <div className="glass-card p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button variant="secondary" onClick={resetGame}>
              Zacznij od nowa
            </Button>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Runda: {currentRound + 1} / {totalRounds}
          </div>
        </div>

        <div className="mb-8">
          {gameType === 'spelling' && currentChallenge && (
            <ChallengeComponent challenge={currentChallenge} onAnswer={handleAnswer} />
          )}
          {gameType === 'multiplication' && currentMultiplicationChallenge && (
            <MultiplicationChallengeComponent challenge={currentMultiplicationChallenge} onAnswer={handleAnswer} />
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary-foreground">
            Wynik: {score}
          </div>
        </div>
      </div>

      {incorrectAnswers.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Błędne odpowiedzi:
          </h3>
          <ul>
            {incorrectAnswers.map((incorrect, index) => (
              <li key={index} className="text-red-500">
                {incorrect.word} - Poprawna odpowiedź: {incorrect.correctAnswer}
              </li>
            ))}
          </ul>
        </div>
      )}

      {incorrectMultiplicationAnswers.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Błędne odpowiedzi z mnożenia:
          </h3>
          <ul>
            {incorrectMultiplicationAnswers.map((incorrect, index) => (
              <li key={index} className="text-red-500">
                {incorrect.num1} x {incorrect.num2} - Poprawna odpowiedź: {incorrect.correctAnswer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default GameScreen;

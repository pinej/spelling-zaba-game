
import React, { useEffect } from 'react';
import { useGameContext } from '../components/GameContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles } from 'lucide-react';
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
            <Sparkles className="h-12 w-12 text-yellow-500 mx-auto" />
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
      
      {/* Remove the incorrect answers display - they'll only be shown at the end screen */}
    </motion.div>
  );
};

export default GameScreen;

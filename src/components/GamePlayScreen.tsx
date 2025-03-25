
import React from 'react';
import { useGameContext } from './GameContext';
import { motion } from 'framer-motion';

const GamePlayScreen: React.FC = () => {
  const { 
    gameType, 
    currentChallenge, 
    currentMultiplicationChallenge, 
    score, 
    currentRound, 
    totalRounds,
    incrementScore,
    addIncorrectAnswer,
    addIncorrectMultiplicationAnswer,
    goToNextChallenge,
    playSound,
    updateStreak
  } = useGameContext();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="game-content bg-white p-8 rounded-xl shadow-lg max-w-md w-full mb-8">
        <div className="flex justify-between mb-6">
          <div className="text-2xl font-bold text-blue-600">Wynik: {score}</div>
          <div className="text-lg text-gray-600">
            Runda: {currentRound + 1} / {totalRounds}
          </div>
        </div>

        {gameType === 'spelling' && currentChallenge && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">{currentChallenge.word}</h2>
            <div className="grid grid-cols-2 gap-4">
              {currentChallenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  className="bg-blue-100 hover:bg-blue-200 py-3 px-6 rounded-lg text-blue-800 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {gameType === 'multiplication' && currentMultiplicationChallenge && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {currentMultiplicationChallenge.firstNumber} × {currentMultiplicationChallenge.secondNumber} = ?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {currentMultiplicationChallenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  className="bg-blue-100 hover:bg-blue-200 py-3 px-6 rounded-lg text-blue-800 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlayScreen;

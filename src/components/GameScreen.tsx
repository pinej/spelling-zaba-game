
import React from 'react';
import { useGameContext } from './GameContext';
import WordChallenge from './WordChallenge';
import { motion } from 'framer-motion';

const GameScreen: React.FC = () => {
  const { 
    score, 
    incrementScore, 
    currentRound, 
    totalRounds, 
    currentChallenge, 
    goToNextChallenge 
  } = useGameContext();
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      incrementScore();
    }
    goToNextChallenge();
  };
  
  if (!currentChallenge) {
    return <div>Loading...</div>;
  }
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="glass-card max-w-2xl w-full rounded-xl overflow-hidden shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="px-4 py-3 bg-primary/10 border-b flex justify-between items-center">
          <div className="text-sm font-medium">
            Runda: <span className="font-bold">{currentRound + 1}</span> / {totalRounds}
          </div>
          <div className="text-sm font-medium">
            Punkty: <span className="font-bold">{score}</span>
          </div>
        </div>
        
        <div className="p-6">
          <WordChallenge 
            challenge={currentChallenge} 
            onAnswer={handleAnswer} 
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameScreen;

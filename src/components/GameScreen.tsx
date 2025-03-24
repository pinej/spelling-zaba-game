
import React from 'react';
import { useGameContext } from './GameContext';
import WordChallenge from './WordChallenge';
import MultiplicationChallenge from './MultiplicationChallenge';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

const GameScreen: React.FC = () => {
  const { gameType, currentChallenge, goToNextChallenge, incrementScore, setGameStatus } = useGameContext();
  
  const handleReturnToHome = () => {
    setGameStatus('start');
    window.location.href = '/';
  };
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      incrementScore();
    }
    
    // Go to next challenge after a delay
    setTimeout(goToNextChallenge, 1500);
  };
  
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleReturnToHome}
          >
            <Home size={16} />
            Powrót
          </Button>
        </div>
        
        {gameType === 'spelling' && currentChallenge ? (
          <WordChallenge 
            challenge={currentChallenge} 
            onAnswer={handleAnswer} 
          />
        ) : (
          <MultiplicationChallenge />
        )}
      </div>
    </motion.div>
  );
};

export default GameScreen;

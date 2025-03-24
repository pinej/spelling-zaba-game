
import React from 'react';
import { useGameContext } from './GameContext';
import WordChallenge from './WordChallenge';
import MultiplicationChallenge from './MultiplicationChallenge';
import { motion } from 'framer-motion';

const GameScreen: React.FC = () => {
  const { gameType } = useGameContext();
  
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {gameType === 'spelling' ? (
        <WordChallenge />
      ) : (
        <MultiplicationChallenge />
      )}
    </motion.div>
  );
};

export default GameScreen;

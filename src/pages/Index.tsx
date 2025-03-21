
import React, { useEffect } from 'react';
import { GameProvider, useGameContext } from '../components/GameContext';
import StartScreen from '../components/StartScreen';
import GameScreen from '../components/GameScreen';
import EndScreen from '../components/EndScreen';
import { motion, AnimatePresence } from 'framer-motion';

// Sounds for the game with WAV extension
const soundFiles = [
  '/correct.wav',
  '/incorrect.wav',
  '/start.wav',
  '/end.wav'
];

const GameContent: React.FC = () => {
  const { gameStatus } = useGameContext();
  
  // Preload game sounds
  useEffect(() => {
    soundFiles.forEach(sound => {
      const audio = new Audio(sound);
      audio.load();
    });
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      {gameStatus === 'start' && (
        <motion.div 
          key="start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StartScreen />
        </motion.div>
      )}
      
      {gameStatus === 'playing' && (
        <motion.div 
          key="playing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GameScreen />
        </motion.div>
      )}
      
      {gameStatus === 'end' && (
        <motion.div 
          key="end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EndScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
};

export default Index;

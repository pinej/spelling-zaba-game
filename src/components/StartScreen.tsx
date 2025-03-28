import React, { useState } from 'react';
import { useGameContext } from './GameContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import SoundToggle from './SoundToggle';
import { useNavigate } from 'react-router-dom';

const StartScreen: React.FC = () => {
  const { setPlayerName, playerName, playSound } = useGameContext();
  const [nameInput, setNameInput] = useState(playerName || '');
  const navigate = useNavigate();
  
  const handleContinue = () => {
    // Save the player name to context
    setPlayerName(nameInput.trim());
    // Play sound only when clicking DALEJ button
    playSound('start');
    // Navigate using React Router instead of window.location
    navigate('/game-selection');
  };
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-yellow-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="glass-card p-8 max-w-lg w-full text-center flex flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="w-full flex justify-end mb-4">
          <SoundToggle />
        </div>
        
        <motion.div
          className="flex items-center justify-center mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Sparkles className="w-8 h-8 text-primary mr-2" />
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Gram i uczę się
        </motion.h1>
        
        <motion.div
          className="w-full max-w-xs mb-6"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-left mb-1">Twoje imię:</label>
          <Input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Wpisz swoje imię"
            className="mb-2"
          />
        </motion.div>
        
        <motion.button
          className="bg-primary text-primary-foreground text-lg md:text-xl px-10 py-4 rounded-full shadow-lg button-hover animate-pulse-scale"
          onClick={handleContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          DALEJ
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default StartScreen;

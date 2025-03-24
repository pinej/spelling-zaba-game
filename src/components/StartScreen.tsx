
import React, { useState } from 'react';
import { useGameContext } from './GameContext';
import { motion } from 'framer-motion';
import { Sparkles, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const StartScreen: React.FC = () => {
  const { soundsEnabled, enableSounds, setPlayerName, playerName } = useGameContext();
  const [nameInput, setNameInput] = useState(playerName || '');
  
  const handleContinue = () => {
    setPlayerName(nameInput.trim());
    // Changed to go to selection screen instead of directly starting the game
    window.location.href = '/game-selection';
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
        
        {!soundsEnabled && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Button 
              variant="outline"
              size="sm"
              onClick={enableSounds}
              className="flex items-center gap-2 mb-4"
            >
              <Volume2 size={16} />
              Włącz dźwięki
            </Button>
          </motion.div>
        )}
        
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

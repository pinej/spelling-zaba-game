
import React, { useState } from 'react';
import { useGameContext } from './GameContext';
import WordChallenge from './WordChallenge';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Sparkles, Volume2, VolumeX, Home } from 'lucide-react';
import { Toggle } from './ui/toggle';

const GameScreen: React.FC = () => {
  const { 
    score, 
    incrementScore, 
    currentRound, 
    totalRounds, 
    currentChallenge, 
    goToNextChallenge,
    soundsEnabled,
    enableSounds,
    toggleMute,
    isMuted,
    setGameStatus,
    playerName
  } = useGameContext();
  
  const [showNextButton, setShowNextButton] = useState(false);
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      incrementScore();
    }
    setShowNextButton(true);
  };
  
  const handleNext = () => {
    setShowNextButton(false);
    goToNextChallenge();
  };

  const handleReturnToMain = () => {
    setGameStatus('start');
  };
  
  if (!currentChallenge) {
    return <div>Loading...</div>;
  }
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-yellow-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 left-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReturnToMain}
          className="flex items-center gap-2"
        >
          <Home size={16} />
          Powrót do menu
        </Button>
      </div>

      <motion.div 
        className="glass-card max-w-2xl w-full rounded-xl overflow-hidden shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="px-4 py-3 bg-primary/20 border-b flex justify-between items-center">
          <div className="text-sm font-medium flex items-center">
            <Sparkles className="w-4 h-4 mr-1 text-primary" />
            Runda: <span className="font-bold ml-1">{currentRound + 1}</span> / {totalRounds}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium flex items-center">
              Punkty: <span className="font-bold ml-1">{score}</span>
              <Sparkles className="w-4 h-4 ml-1 text-primary" />
            </div>
            
            {/* Sound controls */}
            {soundsEnabled ? (
              <Toggle 
                pressed={!isMuted} 
                onPressedChange={() => toggleMute()} 
                aria-label={isMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
                className="ml-2"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Toggle>
            ) : null}
          </div>
        </div>
        
        <div className="p-6">
          {playerName && (
            <div className="mb-2 text-center font-medium">
              {playerName}, wybierz poprawną literę:
            </div>
          )}
          
          {!soundsEnabled && (
            <motion.div 
              className="mb-4 p-2 bg-yellow-100 rounded-md flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                onClick={enableSounds}
                className="flex items-center gap-2"
              >
                <Volume2 size={16} />
                Włącz dźwięki
              </Button>
            </motion.div>
          )}
          
          <WordChallenge 
            challenge={currentChallenge} 
            onAnswer={handleAnswer} 
          />
          
          {showNextButton && (
            <motion.div 
              className="mt-6 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                onClick={handleNext}
                className="px-8 py-2 text-lg bg-primary hover:bg-primary/90"
                size="lg"
              >
                Dalej
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameScreen;

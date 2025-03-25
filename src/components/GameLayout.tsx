
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StreakInfo } from '../types/game';

interface GameLayoutProps {
  children: ReactNode;
  score: number;
  currentRound: number;
  totalRounds: number;
  streak: StreakInfo;
  onReset: () => void;
  returnPath?: string;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  score,
  currentRound,
  totalRounds,
  streak,
  onReset,
  returnPath = '/game-selection'
}) => {
  const navigate = useNavigate();
  
  const handleReturnToSelection = () => {
    navigate(returnPath);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleReturnToSelection} className="flex items-center gap-2">
              <Home size={18} />
              Powrót
            </Button>
            <Button variant="secondary" onClick={onReset}>
              Zacznij od nowa
            </Button>
          </div>
          <div className="text-lg font-medium">
            Runda: {currentRound + 1}/{totalRounds}
          </div>
        </div>

        <div className="mb-8">
          {children}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary-foreground">
            Wynik: {score}
          </div>
        </div>
      </div>
      
      {streak.showCongratulations && (
        <motion.div
          className="mt-6 bg-accent/20 p-6 rounded-lg text-center w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-2xl font-bold text-primary-foreground mb-2">{streak.congratulationMessage}</h2>
            <p className="text-muted-foreground">
              Masz już {streak.currentStreak} poprawnych odpowiedzi z rzędu!
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameLayout;

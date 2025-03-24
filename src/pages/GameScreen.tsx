
import React from 'react';
import { useGameContext } from '../components/GameContext';
import WordChallenge from '../components/WordChallenge';
import MultiplicationChallenge from '../components/MultiplicationChallenge';
import { Home, Book } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GameScreen: React.FC = () => {
  const { 
    gameType, 
    currentChallenge, 
    currentMultiplicationChallenge, 
    goToNextChallenge,
    addIncorrectAnswer,
    addIncorrectMultiplicationAnswer,
    incrementScore,
    playSound,
    currentRound,
    totalRounds,
    playerName,
    updateStreak
  } = useGameContext();
  const navigate = useNavigate();

  const handleReturnToHome = () => {
    navigate('/');
  };

  // For the "spelling" game type
  const handleWordAnswer = (isCorrect: boolean) => {
    if (!currentChallenge) return;
    
    if (isCorrect) {
      incrementScore();
      playSound('correct');
      updateStreak(true);
    } else {
      playSound('incorrect');
      addIncorrectAnswer(currentChallenge);
      updateStreak(false);
    }
    
    setTimeout(() => {
      goToNextChallenge();
    }, 1500);
  };
  
  // For the "multiplication" game type
  const handleMultiplicationAnswer = (selectedAnswer: number) => {
    if (!currentMultiplicationChallenge) return;
    
    const isCorrect = selectedAnswer === currentMultiplicationChallenge.correctAnswer;
    
    if (isCorrect) {
      incrementScore();
      playSound('correct');
      updateStreak(true);
    } else {
      playSound('incorrect');
      addIncorrectMultiplicationAnswer(currentMultiplicationChallenge);
      updateStreak(false);
    }
    
    setTimeout(() => {
      goToNextChallenge();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8 px-4">
      {gameType === 'spelling' && (
        <div className="max-w-3xl mx-auto">
          <div className="w-full flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={handleReturnToHome}
            >
              <Home size={16} />
              Powrót
            </Button>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Book className="h-5 w-5" />
              <span>Pytanie {currentRound + 1} z {totalRounds}</span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentChallenge && (
              <WordChallenge
                challenge={currentChallenge}
                onAnswer={handleWordAnswer}
                playerName={playerName}
              />
            )}
          </motion.div>
        </div>
      )}
      
      {gameType === 'multiplication' && (
        <div className="max-w-3xl mx-auto">
          <MultiplicationChallenge />
        </div>
      )}
    </div>
  );
};

export default GameScreen;

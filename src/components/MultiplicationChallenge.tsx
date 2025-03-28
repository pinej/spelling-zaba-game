
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from './GameContext';
import { Button } from './ui/button';
import { Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MultiplicationChallenge as MultiplicationChallengeType } from '../types/game';

interface MultiplicationChallengeProps {
  challenge?: MultiplicationChallengeType;
  onAnswer?: (selectedAnswer: number) => void;
}

const MultiplicationChallenge: React.FC<MultiplicationChallengeProps> = ({ 
  challenge,
  onAnswer: propOnAnswer
}) => {
  const { 
    currentMultiplicationChallenge, 
    goToNextChallenge, 
    incrementScore, 
    addIncorrectMultiplicationAnswer,
    currentRound,
    totalRounds,
    playerName,
    updateStreak,
    streak
  } = useGameContext();
  
  const activeChallenge = challenge || currentMultiplicationChallenge;
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Reset state when challenge changes
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [activeChallenge]);
  
  const handleAnswerClick = (answer: number) => {
    if (showFeedback || !activeChallenge) return;
    
    setSelectedAnswer(answer);
    
    const correct = answer === activeChallenge.correctAnswer;
    setIsCorrect(correct);
    
    if (propOnAnswer) {
      propOnAnswer(answer);
    } else {
      if (correct) {
        incrementScore();
        updateStreak(true);
      } else {
        addIncorrectMultiplicationAnswer(activeChallenge);
        updateStreak(false);
      }
      
      setShowFeedback(true);
      
      // Proceed to next challenge after a delay
      setTimeout(() => {
        goToNextChallenge();
      }, streak.showCongratulations ? 3000 : 1500);
    }
  };
  
  if (!activeChallenge) return null;
  
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="w-full flex items-center justify-between mb-6">
        <div></div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calculator className="h-5 w-5" />
          <span>Pytanie {currentRound + 1} z {totalRounds}</span>
        </div>
      </div>
      
      <motion.div 
        className="glass-card w-full p-8 mb-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl mb-2 text-muted-foreground">
          {playerName ? `${playerName}, ile to jest:` : 'Ile to jest:'}
        </h2>
        
        <div className="text-4xl md:text-5xl font-bold my-6 text-primary">
          {activeChallenge.firstNumber} × {activeChallenge.secondNumber} = ?
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-6">
          {activeChallenge.options.map((option, index) => (
            <motion.button
              key={index}
              className={`
                py-3 px-4 md:py-4 md:px-6 text-xl md:text-2xl rounded-lg button-hover
                ${selectedAnswer === option && isCorrect ? 'bg-success/20 text-success border-success/50 border-2' : ''}
                ${selectedAnswer === option && !isCorrect ? 'bg-destructive/20 text-destructive border-destructive/50 border-2' : ''}
                ${selectedAnswer !== option && option === activeChallenge.correctAnswer && showFeedback ? 'bg-success/10 text-success border-success/50 border-2' : ''}
                ${!selectedAnswer ? 'bg-white border-2 border-primary/50 shadow-sm hover:shadow-md hover:border-primary' : ''}
              `}
              onClick={() => handleAnswerClick(option)}
              disabled={showFeedback}
              whileHover={{ scale: !showFeedback ? 1.03 : 1 }}
              whileTap={{ scale: !showFeedback ? 0.98 : 1 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      {/* Move streak congratulations below the game card */}
      <AnimatePresence>
        {streak.showCongratulations && (
          <motion.div
            className="bg-accent/20 p-6 rounded-lg text-center my-4 w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-accent mb-2">
                {streak.congratulationMessage}
              </h3>
              <p className="text-muted-foreground">
                Masz już {streak.currentStreak} poprawnych odpowiedzi z rzędu!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiplicationChallenge;

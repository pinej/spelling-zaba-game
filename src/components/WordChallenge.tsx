
import React, { useState, useEffect } from 'react';
import { useGameContext } from './GameContext';
import { Challenge } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

type WordChallengeProps = {
  challenge: Challenge;
  onAnswer: (isCorrect: boolean) => void;
  playerName?: string;
};

const WordChallenge: React.FC<WordChallengeProps> = ({ challenge, onAnswer, playerName }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { playSound, addIncorrectAnswer } = useGameContext();
  
  // Reset state when challenge changes
  useEffect(() => {
    setSelectedOption(null);
    setShowResult(false);
  }, [challenge]);
  
  const handleOptionSelect = (option: string) => {
    if (showResult) return; // Prevent multiple selections
    
    setSelectedOption(option);
    
    const isCorrect = option === challenge.correctOption;
    
    // Play the sound immediately when the option is selected
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('incorrect');
      addIncorrectAnswer(challenge);
    }
    
    setShowResult(true);
    
    // Use a timeout to allow the user to see the result before proceeding
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1000);
  };
  
  const isCorrectAnswer = (option: string) => {
    return showResult && option === challenge.correctOption;
  };
  
  const isWrongAnswer = (option: string) => {
    return showResult && selectedOption === option && option !== challenge.correctOption;
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      key={challenge.id} // Add key to force re-render when challenge changes
    >
      <div className="mb-8 text-center">
        <motion.div 
          className="text-2xl md:text-3xl mb-2 font-medium text-primary-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {playerName ? `${playerName}, wybierz brakującą literę:` : 'Wybierz brakującą literę:'}
        </motion.div>
        
        <motion.div 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 flex items-center justify-center flex-wrap"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span>{challenge.prefix}</span>
          
          {/* Empty space for the missing letter(s) */}
          <span className="inline-block mx-1 px-2 min-w-[1.5em] border-b-4 border-primary border-dashed">
            {showResult ? 
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${selectedOption === challenge.correctOption ? "text-success" : "text-destructive"}`}
              >
                {selectedOption}
              </motion.span> : 
              <span>&nbsp;</span>
            }
          </span>
          
          <span>{challenge.suffix}</span>
        </motion.div>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 gap-3 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {challenge.options.map((option, index) => (
          <motion.button
            key={index}
            className={`letter-choice ${isCorrectAnswer(option) ? "letter-choice-correct" : ""} ${isWrongAnswer(option) ? "letter-choice-incorrect" : ""}`}
            onClick={() => handleOptionSelect(option)}
            disabled={showResult}
            whileHover={!showResult ? { scale: 1.05 } : {}}
            whileTap={!showResult ? { scale: 0.95 } : {}}
          >
            {option}
          </motion.button>
        ))}
      </motion.div>
      
      {showResult && (
        <AnimatePresence>
          <motion.div 
            className="mt-8 text-xl font-medium text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedOption === challenge.correctOption ? (
              <div className="text-success">Dobrze!</div>
            ) : (
              <div className="text-destructive">
                Niepoprawnie! Poprawna odpowiedź: <span className="font-bold">{challenge.correctOption}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default WordChallenge;

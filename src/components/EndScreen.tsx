
import React from 'react';
import { useGameContext } from './GameContext';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const EndScreen: React.FC = () => {
  const { score, totalRounds, resetGame, setGameStatus, incorrectAnswers } = useGameContext();
  
  const scorePercentage = (score / totalRounds) * 100;
  
  const getFeedback = () => {
    if (scorePercentage >= 90) return "Wspaniale! Jesteś mistrzem ortografii!";
    if (scorePercentage >= 70) return "Bardzo dobrze! Prawie wszystko umiesz!";
    if (scorePercentage >= 50) return "Dobrze! Ale warto jeszcze poćwiczyć.";
    return "Spróbuj jeszcze raz, na pewno się uda!";
  };
  
  const hasIncorrectAnswers = incorrectAnswers.length > 0;
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="glass-card max-w-lg w-full text-center p-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Koniec gry!
        </motion.h2>
        
        <motion.div 
          className="text-6xl font-bold my-6 text-primary"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
        >
          {score} / {totalRounds}
        </motion.div>
        
        <motion.p 
          className="mb-8 text-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {getFeedback()}
        </motion.p>
        
        {hasIncorrectAnswers && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <motion.h3
              className="text-xl font-bold mb-4 text-destructive"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              Zapamiętaj te słowa!
            </motion.h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Słowo</TableHead>
                  <TableHead>Poprawna litera</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incorrectAnswers.map((challenge, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {challenge.prefix}
                      <span className="text-primary font-bold">{challenge.correctOption}</span>
                      {challenge.suffix}
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {challenge.correctOption}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            className="bg-primary text-white px-6 py-3 rounded-full shadow-md button-hover"
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Zagraj Ponownie
          </motion.button>
          
          <motion.button
            className="bg-secondary text-secondary-foreground px-6 py-3 rounded-full shadow-md button-hover"
            onClick={() => setGameStatus('start')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            Menu Główne
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EndScreen;


import React from 'react';
import { useGameContext } from './GameContext';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const EndScreen: React.FC = () => {
  const { 
    score, 
    totalRounds, 
    resetGame, 
    setGameStatus, 
    incorrectAnswers, 
    incorrectMultiplicationAnswers,
    playerName,
    gameType
  } = useGameContext();
  
  const navigate = useNavigate();
  
  const handleReturnToHome = () => {
    setGameStatus('start');
    navigate('/');
  };
  
  const handlePlayAgain = () => {
    resetGame();
    
    // Navigate to the appropriate game route based on gameType
    if (gameType === 'spelling') {
      navigate('/ortografia');
    } else if (gameType === 'multiplication') {
      navigate('/mnozenie');
    }
  };
  
  // Calculate percentage score
  const percentage = Math.round((score / totalRounds) * 100);
  
  // Personalized feedback based on score
  const getFeedback = () => {
    if (percentage >= 90) return `Wspaniale, ${playerName}! Jesteś mistrzem!`;
    if (percentage >= 70) return `Bardzo dobrze, ${playerName}! Robisz postępy!`;
    if (percentage >= 50) return `Dobrze, ${playerName}. Możesz być z siebie dumny/a!`;
    return `${playerName}, ćwicz dalej a będzie lepiej!`;
  };
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="glass-card p-8 max-w-3xl w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleReturnToHome}
          >
            <Home size={16} />
            Powrót
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Koniec gry!</h1>
          <p className="text-xl mb-2">
            Twój wynik: <span className="font-bold">{score}/{totalRounds}</span> ({percentage}%)
          </p>
          <p className="text-lg text-muted-foreground">{getFeedback()}</p>
        </div>
        
        {gameType === 'spelling' && incorrectAnswers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Popracuj nad tymi słowami:</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Słowo</TableHead>
                  <TableHead>Poprawna odpowiedź</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incorrectAnswers.map((challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell>
                      {challenge.prefix}
                      <span className="text-destructive font-bold">{challenge.correctOption}</span>
                      {challenge.suffix}
                    </TableCell>
                    <TableCell className="font-medium">{challenge.correctOption}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {gameType === 'multiplication' && incorrectMultiplicationAnswers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Popracuj nad tymi działaniami:</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Działanie</TableHead>
                  <TableHead>Poprawna odpowiedź</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incorrectMultiplicationAnswers.map((challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell>
                      {challenge.firstNumber} × {challenge.secondNumber}
                    </TableCell>
                    <TableCell className="font-medium">{challenge.correctAnswer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="flex justify-center mt-8">
          <Button
            className="px-8 py-6 text-lg bg-primary"
            onClick={handlePlayAgain}
          >
            Zagraj ponownie
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EndScreen;

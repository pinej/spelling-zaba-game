
import React from 'react';
import { useGameContext } from '../components/GameContext';
import WordChallenge from '../components/WordChallenge';
import MultiplicationChallenge from '../components/MultiplicationChallenge';
import EndScreen from '../components/EndScreen';
import { Button } from '@/components/ui/button';
import { Home, BookText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameScreen: React.FC = () => {
  const { 
    gameStatus, 
    gameType, 
    currentChallenge, 
    incrementScore, 
    goToNextChallenge, 
    playSound, 
    addIncorrectAnswer,
    currentRound,
    totalRounds,
    setGameStatus
  } = useGameContext();
  
  const navigate = useNavigate();
  
  const handleReturnToHome = () => {
    setGameStatus('start');
    navigate('/');
  };
  
  // Handle answer for WordChallenge
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      incrementScore();
    }
    
    // Go to next challenge after a delay
    setTimeout(goToNextChallenge, 1500);
  };
  
  // Render appropriate screen based on game status
  if (gameStatus === 'end') {
    return <EndScreen />;
  }
  
  // Render the appropriate game based on the game type
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="w-full max-w-3xl px-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handleReturnToHome}
          >
            <Home size={16} />
            Powrót
          </Button>
          
          {gameType === 'spelling' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookText className="h-5 w-5" />
              <span>Pytanie {currentRound + 1} z {totalRounds}</span>
            </div>
          )}
        </div>
        
        {gameType === 'spelling' && currentChallenge ? (
          <WordChallenge 
            challenge={currentChallenge} 
            onAnswer={handleAnswer} 
          />
        ) : (
          <MultiplicationChallenge />
        )}
      </div>
    </div>
  );
};

export default GameScreen;

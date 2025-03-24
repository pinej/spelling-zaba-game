
import React from 'react';
import { useGameContext } from '../components/GameContext';
import WordChallenge from '../components/WordChallenge';
import MultiplicationChallenge from '../components/MultiplicationChallenge';
import EndScreen from '../components/EndScreen';

const GameScreen: React.FC = () => {
  const { 
    gameStatus, 
    gameType, 
    currentChallenge, 
    incrementScore, 
    goToNextChallenge, 
    playSound, 
    addIncorrectAnswer 
  } = useGameContext();
  
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
      {gameType === 'spelling' && currentChallenge ? (
        <WordChallenge 
          challenge={currentChallenge} 
          onAnswer={handleAnswer} 
        />
      ) : (
        <MultiplicationChallenge />
      )}
    </div>
  );
};

export default GameScreen;


import React from 'react';
import { useGameContext } from '../components/GameContext';
import WordChallenge from '../components/WordChallenge';
import MultiplicationChallenge from '../components/MultiplicationChallenge';
import EndScreen from '../components/EndScreen';

const GameScreen: React.FC = () => {
  const { gameStatus, gameType } = useGameContext();
  
  // Render appropriate screen based on game status
  if (gameStatus === 'end') {
    return <EndScreen />;
  }
  
  // Render the appropriate game based on the game type
  return (
    <>
      {gameType === 'spelling' ? (
        <WordChallenge />
      ) : (
        <MultiplicationChallenge />
      )}
    </>
  );
};

export default GameScreen;

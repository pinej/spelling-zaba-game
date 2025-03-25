
import React from 'react';
import { Challenge } from '../types/game';
import WordChallenge from './WordChallenge';

interface ChallengeComponentProps {
  challenge: Challenge;
  onAnswer: (selectedAnswer: string | number) => void;
}

const ChallengeComponent: React.FC<ChallengeComponentProps> = ({ challenge, onAnswer }) => {
  return (
    <WordChallenge 
      challenge={challenge} 
      onAnswer={(isCorrect) => {
        if (isCorrect) {
          onAnswer(challenge.correctOption);
        } else {
          // Pass one of the incorrect options
          const incorrectOption = challenge.options.find(option => option !== challenge.correctOption) || "";
          onAnswer(incorrectOption);
        }
      }} 
    />
  );
};

export default ChallengeComponent;

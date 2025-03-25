
import React from 'react';
import { MultiplicationChallenge } from '../types/game';
import MultiplicationChallenge from './MultiplicationChallenge';

interface MultiplicationChallengeComponentProps {
  challenge: MultiplicationChallenge;
  onAnswer: (selectedAnswer: string | number) => void;
}

const MultiplicationChallengeComponent: React.FC<MultiplicationChallengeComponentProps> = ({ 
  challenge, 
  onAnswer 
}) => {
  return (
    <MultiplicationChallenge />
  );
};

export default MultiplicationChallengeComponent;

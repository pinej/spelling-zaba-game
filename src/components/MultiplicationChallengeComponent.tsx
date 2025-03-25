
import React from 'react';
import { MultiplicationChallenge as MultiplicationChallengeType } from '../types/game';
import MultiplicationChallengeUI from './MultiplicationChallenge';

interface MultiplicationChallengeComponentProps {
  challenge: MultiplicationChallengeType;
  onAnswer: (selectedAnswer: string | number) => void;
}

const MultiplicationChallengeComponent: React.FC<MultiplicationChallengeComponentProps> = ({ 
  challenge, 
  onAnswer 
}) => {
  return (
    <MultiplicationChallengeUI />
  );
};

export default MultiplicationChallengeComponent;

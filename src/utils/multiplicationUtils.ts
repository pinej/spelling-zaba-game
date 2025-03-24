
import { MultiplicationChallenge } from '../types/game';

// Generate random number between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Create a multiplication challenge
const createMultiplicationChallenge = (id: number): MultiplicationChallenge => {
  // Generate two random numbers between 1 and 9
  const firstNumber = getRandomInt(1, 9);
  const secondNumber = getRandomInt(1, 9);
  const correctAnswer = firstNumber * secondNumber;
  
  // Make sure product is 30 or less
  if (correctAnswer > 30) {
    return createMultiplicationChallenge(id);
  }
  
  // Generate 3 wrong answers that are close to the correct answer
  const wrongAnswers: number[] = [];
  while (wrongAnswers.length < 3) {
    // Generate a wrong answer within ±5 of the correct answer, but not equal to it
    let wrongAnswer = correctAnswer + getRandomInt(-5, 5);
    
    // Ensure the wrong answer is positive and not equal to the correct answer
    // and not already in the wrong answers array
    if (
      wrongAnswer > 0 && 
      wrongAnswer !== correctAnswer && 
      !wrongAnswers.includes(wrongAnswer)
    ) {
      wrongAnswers.push(wrongAnswer);
    }
  }
  
  // Combine correct and wrong answers, then shuffle
  const options = [correctAnswer, ...wrongAnswers];
  
  // Shuffle the options array
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id,
    firstNumber,
    secondNumber,
    correctAnswer,
    options
  };
};

// Generate a set of multiplication challenges
export const generateMultiplicationChallenges = (count = 10): MultiplicationChallenge[] => {
  const challenges: MultiplicationChallenge[] = [];
  
  for (let i = 0; i < count; i++) {
    challenges.push(createMultiplicationChallenge(i));
  }
  
  return challenges;
};

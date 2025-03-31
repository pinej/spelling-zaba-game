import { Challenge } from '../types/game';

// The text with vocabulary
const TEXT = "Żaba mówi żartem, że zostawiła nad rzeką auto. Żuk, który lubi kałuże ma też parasol w żółte róże. Jeż leży na świeżym powietru. Zwierzęta oglądają pejzaż. Zastała ich bardzo duża burza.";

// Extract words from text
const extractWords = (): string[] => {
  // Clean up the text and split into words
  return TEXT
    .replace(/[.,]/g, '')
    .split(' ')
    .map(word => word.trim())
    .filter(word => word.length > 0);
};

// Get words with difficult letter patterns
const getWordsWithDifficultPatterns = (): string[] => {
  const words = extractWords();
  
  // Find words with difficult patterns (ż/rz, u/ó, h/ch)
  return words.filter(word => 
    word.includes('ż') || 
    word.includes('rz') || 
    word.includes('ó') || 
    word.includes('u') || 
    word.includes('h') || 
    word.includes('ch')
  );
};

// Create challenge for a specific word
const createChallenge = (word: string, id: number): Challenge | null => {
  // Detect which pattern to test
  let prefix = '';
  let suffix = '';
  let correctOption = '';
  let options: string[] = [];
  
  // Handle ż vs rz
  if (word.includes('ż')) {
    const index = word.indexOf('ż');
    prefix = word.substring(0, index);
    suffix = word.substring(index + 1);
    correctOption = 'ż';
    options = ['ż', 'rz'];
  } else if (word.includes('rz')) {
    const index = word.indexOf('rz');
    prefix = word.substring(0, index);
    suffix = word.substring(index + 2);
    correctOption = 'rz';
    options = ['ż', 'rz'];
  }
  // Handle ó vs u
  else if (word.includes('ó')) {
    const index = word.indexOf('ó');
    prefix = word.substring(0, index);
    suffix = word.substring(index + 1);
    correctOption = 'ó';
    options = ['u', 'ó'];
  } else if (word.includes('u')) {
    const index = word.indexOf('u');
    prefix = word.substring(0, index);
    suffix = word.substring(index + 1);
    correctOption = 'u';
    options = ['u', 'ó'];
  }
  // Handle h vs ch
  else if (word.includes('ch')) {
    const index = word.indexOf('ch');
    prefix = word.substring(0, index);
    suffix = word.substring(index + 2);
    correctOption = 'ch';
    options = ['h', 'ch'];
  } else if (word.includes('h') && !word.includes('ch')) {
    const index = word.indexOf('h');
    prefix = word.substring(0, index);
    suffix = word.substring(index + 1);
    correctOption = 'h';
    options = ['h', 'ch'];
  } else {
    return null; // No challenging pattern found
  }
  
  return {
    id,
    word,
    options,
    correctOption,
    prefix,
    suffix
  };
};

// Shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate all challenges for the game
export const generateChallenges = (): Challenge[] => {
  const wordsWithPatterns = getWordsWithDifficultPatterns();
  const shuffledWords = shuffleArray(wordsWithPatterns);
  
  const challenges: Challenge[] = [];
  let id = 0;
  
  // Create challenges until we have 10 or run out of words
  for (const word of shuffledWords) {
    const challenge = createChallenge(word, id);
    if (challenge) {
      challenges.push(challenge);
      id++;
      if (challenges.length >= 10) break;
    }
  }
  
  // If we don't have enough challenges, reuse some words
  while (challenges.length < 10) {
    // Take a random word from our existing challenges and create a new challenge from it
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const randomWord = challenges[randomIndex].word;
    const challenge = createChallenge(randomWord, id);
    if (challenge) {
      challenges.push(challenge);
      id++;
    }
  }
  
  return challenges;
};

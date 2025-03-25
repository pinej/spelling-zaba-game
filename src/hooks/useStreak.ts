
import { useState } from 'react';
import { StreakInfo } from '../types/game';

export function useStreak() {
  const [streak, setStreak] = useState<StreakInfo>({
    currentStreak: 0,
    showCongratulations: false,
    congratulationMessage: ''
  });
  
  const updateStreak = (correct: boolean) => {
    if (correct) {
      const newStreakCount = streak.currentStreak + 1;
      
      let showCongrats = false;
      let message = '';
      
      if (newStreakCount === 3) {
        showCongrats = true;
        message = "Świetnie Ci idzie!";
      } else if (newStreakCount === 10) {
        showCongrats = true;
        message = "Wow - mistrzowski wynik!";
      }
      
      setStreak({
        currentStreak: newStreakCount,
        showCongratulations: showCongrats,
        congratulationMessage: message
      });
    } else {
      // Reset streak on incorrect answer
      resetStreak();
    }
  };

  const resetStreak = () => {
    setStreak({
      currentStreak: 0,
      showCongratulations: false,
      congratulationMessage: ''
    });
  };

  return {
    streak,
    updateStreak,
    resetStreak
  };
}

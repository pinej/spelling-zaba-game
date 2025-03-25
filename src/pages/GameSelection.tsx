
import React from 'react';
import { useGameContext } from '../components/GameContext';
import { motion } from 'framer-motion';
import { BookText, Calculator, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import SoundToggle from '../components/SoundToggle';

const GameSelection: React.FC = () => {
  const { playerName, resetGame, setGameType } = useGameContext();
  const navigate = useNavigate();

  const handleStartSpellingGame = () => {
    setGameType('spelling');
    resetGame();
    navigate('/game'); // Navigate to the game screen after setting the game type
  };

  const handleStartMultiplicationGame = () => {
    setGameType('multiplication');
    resetGame();
    navigate('/game'); // Navigate to the game screen after setting the game type
  };

  const handleReturnToHome = () => {
    navigate('/'); // Navigate to the main screen
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center bg-blue-50 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={handleReturnToHome}
            className="flex items-center gap-2"
          >
            <Home size={18} />
            Powrót
          </Button>
          <SoundToggle />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">
            Cześć, {playerName ? playerName : 'Uczniu'}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Wybierz w co chcesz dzisiaj zagrać
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="transition duration-200"
          >
            <Card className="h-full hover:border-primary">
              <CardHeader className="bg-primary/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BookText className="h-6 w-6 text-primary" />
                  Polska Ortografia
                </CardTitle>
                <CardDescription>Nauka trudnych liter</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p>Wybierz poprawną literę w każdym słowie i zdobądź punkty!</p>
                <Button 
                  className="w-full mt-6"
                  onClick={handleStartSpellingGame}
                >
                  Zagraj teraz
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
            className="transition duration-200"
          >
            <Card className="h-full hover:border-primary">
              <CardHeader className="bg-accent/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-accent" />
                  Nauka mnożenia do 30
                </CardTitle>
                <CardDescription>Ćwicz tabliczkę mnożenia</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p>Rozwiązuj działania mnożenia i stań się mistrzem matematyki!</p>
                <Button 
                  className="w-full mt-6 bg-accent hover:bg-accent/90"
                  onClick={handleStartMultiplicationGame}
                >
                  Zagraj teraz
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameSelection;

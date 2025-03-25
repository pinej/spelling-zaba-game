
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./components/GameContext";
import Index from "./pages/Index";
import GameSelection from "./pages/GameSelection";
import GameScreen from "./pages/GameScreen";
import SpellingGame from "./pages/SpellingGame";
import MultiplicationGame from "./pages/MultiplicationGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game-selection" element={<GameSelection />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/ortografia" element={<SpellingGame />} />
            <Route path="/mnozenie" element={<MultiplicationGame />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

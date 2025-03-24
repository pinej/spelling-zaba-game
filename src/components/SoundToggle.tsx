
import React from 'react';
import { useGameContext } from './GameContext';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Toggle } from './ui/toggle';

const SoundToggle: React.FC = () => {
  const { isMuted, toggleMute, soundsEnabled, enableSounds } = useGameContext();
  
  const handleToggle = () => {
    if (!soundsEnabled) {
      enableSounds();
    } else {
      toggleMute();
    }
  };
  
  return (
    <Toggle
      pressed={!isMuted}
      onPressedChange={handleToggle}
      aria-label={isMuted ? "Włącz dźwięki" : "Wycisz dźwięki"}
      className="flex items-center justify-center w-10 h-10 rounded-full"
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Toggle>
  );
};

export default SoundToggle;

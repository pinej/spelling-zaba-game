
import { useState, useEffect } from 'react';
import { 
  SOUND_PATHS, 
  SoundType, 
  createAudioElements, 
  initializeAudio, 
  playAudioWithErrorHandling,
  checkAudioFiles
} from '../utils/audioUtils';

export function useAudio() {
  const [sounds, setSounds] = useState<Record<string, HTMLAudioElement | null>>({
    correct: null,
    incorrect: null,
    start: null,
    end: null,
  });
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    
    // Update all audio elements
    Object.values(sounds).forEach(sound => {
      if (sound) {
        sound.muted = !isMuted;
      }
    });
  };

  // Initialize AudioContext on first user interaction
  const enableSounds = () => {
    if (soundsEnabled) return; // Skip if already enabled
    
    console.log("Enabling sounds via user interaction");
    
    // Create AudioContext
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (context.state === 'suspended') {
        context.resume().then(() => {
          console.log("AudioContext resumed successfully");
        }).catch(err => {
          console.error("Failed to resume AudioContext:", err);
        });
      }
      setAudioContext(context);
    } catch (e) {
      console.error("Error creating AudioContext:", e);
    }
    
    // Create and preload audio elements
    const audioElements = createAudioElements(isMuted);
    
    // Set up all audio elements
    Object.entries(audioElements).forEach(([type, audio]) => {
      // Log success or failure
      audio.addEventListener('canplaythrough', () => {
        console.log(`Sound loaded successfully: ${type}`);
      });
      
      audio.addEventListener('error', (e) => {
        // Check if the error is a 404
        if ((e.target as HTMLAudioElement).error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
          console.error(`Sound file not found or not supported: ${type} (${audio.src})`);
        } else {
          console.error(`Error loading sound: ${type}`, (e.target as HTMLAudioElement).error);
        }
      });
      
      // Initialize audio
      initializeAudio(audio, type);
    });
    
    setSounds(audioElements);
    setSoundsEnabled(true);
    
    // Play a test sound after a short delay
    setTimeout(() => {
      const testSound = audioElements.start;
      if (testSound) {
        testSound.currentTime = 0;
        testSound.volume = 0.5; // Lower volume for test sound
        initializeAudio(testSound, 'test');
      }
    }, 500);
  };

  // Set up event listeners for enabling audio on any user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!soundsEnabled) {
        enableSounds();
      }
    };
    
    // Add various interaction listeners
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    
    checkAudioFiles();
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      
      // Clean up audio context
      if (audioContext) {
        audioContext.close().catch(err => {
          console.error("Error closing AudioContext:", err);
        });
      }
      
      // Clean up audio elements
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.src = '';
        }
      });
    };
  }, [soundsEnabled, audioContext]);

  const playSound = (type: SoundType) => {
    // If sounds aren't enabled yet, try to enable them
    if (!soundsEnabled) {
      console.log("Sounds not enabled yet, attempting to enable...");
      enableSounds();
      // Early return - the next sound play attempt will work after initialization
      return;
    }
    
    // Don't try to play sounds if muted
    if (isMuted) {
      console.log(`Sound ${type} not played because audio is muted`);
      return;
    }
    
    const sound = sounds[type];
    playAudioWithErrorHandling(sound, type, audioContext, () => {
      // If there's an autoplay policy issue, attempt to re-enable sounds
      setSoundsEnabled(false);
    });
  };

  return {
    playSound,
    soundsEnabled,
    enableSounds,
    isMuted,
    toggleMute
  };
}

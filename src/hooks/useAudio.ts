import { useState, useEffect } from 'react';

// Define sound file paths with correct path references and WAV extension
const SOUND_PATHS = {
  correct: '/correct.wav',
  incorrect: '/incorrect.wav',
  start: '/start.wav',
  end: '/end.wav'
};

type SoundType = 'correct' | 'incorrect' | 'start' | 'end';

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
    const audioElements: Record<string, HTMLAudioElement> = {
      correct: new Audio(SOUND_PATHS.correct),
      incorrect: new Audio(SOUND_PATHS.incorrect),
      start: new Audio(SOUND_PATHS.start),
      end: new Audio(SOUND_PATHS.end)
    };
    
    // Set up all audio elements
    Object.entries(audioElements).forEach(([type, audio]) => {
      audio.volume = 1.0;
      audio.muted = isMuted;
      audio.preload = 'auto';
      
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
      
      // Force loading
      audio.load();
      
      // Test play (and immediately pause) to prime the audio system
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log(`Sound initialized: ${type}`);
      }).catch(err => {
        console.warn(`Couldn't initialize sound ${type}:`, err.message);
      });
    });
    
    setSounds(audioElements);
    setSoundsEnabled(true);
    
    // Play a test sound after a short delay to verify sounds are working
    setTimeout(() => {
      const testSound = audioElements.start;
      if (testSound) {
        testSound.currentTime = 0;
        testSound.volume = 0.5; // Lower volume for test sound
        testSound.play().then(() => {
          console.log("Test sound played successfully");
        }).catch(err => {
          console.error("Test sound failed:", err.message);
        });
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
    
    // Check if audio files exist
    const checkAudioFiles = async () => {
      for (const [type, path] of Object.entries(SOUND_PATHS)) {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (!response.ok) {
            console.error(`Sound file not found: ${type} (${path})`);
          } else {
            console.log(`Sound file exists: ${type} (${path})`);
          }
        } catch (err) {
          console.error(`Error checking sound file ${type}:`, err);
        }
      }
    };
    
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
    if (!sound) {
      console.warn(`Sound not loaded for type: ${type}`);
      return;
    }
    
    console.log(`Playing sound: ${type} from ${sound.src}`);
    
    // Reset to beginning and ensure volume is up
    sound.currentTime = 0;
    sound.volume = 1.0;
    sound.muted = false;
    
    // Resume AudioContext if it exists and is suspended
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().catch(err => {
        console.error("Failed to resume AudioContext:", err);
      });
    }
    
    // Play the sound with better error handling
    try {
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error(`Error playing sound ${type}:`, e.message);
          
          // If there's an autoplay policy issue, show a message or UI element
          if (e.name === 'NotAllowedError') {
            console.warn("Autoplay policy prevented sound from playing - user interaction required");
            
            // Attempt to re-enable sounds
            setSoundsEnabled(false);
          }
        });
      }
    } catch (e) {
      console.error('Critical error playing sound:', e);
    }
  };

  return {
    playSound,
    soundsEnabled,
    enableSounds,
    isMuted,
    toggleMute
  };
}

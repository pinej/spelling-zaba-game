
// Sound file paths
export const SOUND_PATHS = {
  correct: '/correct.wav',
  incorrect: '/incorrect.wav',
  start: '/start.wav',
  end: '/end.wav'
};

export type SoundType = 'correct' | 'incorrect' | 'start' | 'end';

// Create and configure audio elements
export const createAudioElements = (isMuted: boolean) => {
  const audioElements: Record<string, HTMLAudioElement> = {
    correct: new Audio(SOUND_PATHS.correct),
    incorrect: new Audio(SOUND_PATHS.incorrect),
    start: new Audio(SOUND_PATHS.start),
    end: new Audio(SOUND_PATHS.end)
  };

  // Setup audio elements
  Object.entries(audioElements).forEach(([type, audio]) => {
    audio.volume = 1.0;
    audio.muted = isMuted;
    audio.preload = 'auto';
    
    // Force loading
    audio.load();
  });

  return audioElements;
};

// Test play (and immediately pause) to prime the audio system
export const initializeAudio = (
  sound: HTMLAudioElement, 
  type: string, 
  onSuccess?: () => void, 
  onError?: (err: Error) => void
) => {
  sound.play().then(() => {
    sound.pause();
    sound.currentTime = 0;
    console.log(`Sound initialized: ${type}`);
    onSuccess?.();
  }).catch(err => {
    console.warn(`Couldn't initialize sound ${type}:`, err.message);
    onError?.(err);
  });
};

// Play a sound with proper error handling
export const playAudioWithErrorHandling = (
  sound: HTMLAudioElement | null, 
  type: string,
  audioContext: AudioContext | null,
  onAutoplayError?: () => void
) => {
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
  
  // Play the sound with error handling
  try {
    const playPromise = sound.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.error(`Error playing sound ${type}:`, e.message);
        
        // If there's an autoplay policy issue, notify caller
        if (e.name === 'NotAllowedError') {
          console.warn("Autoplay policy prevented sound from playing - user interaction required");
          onAutoplayError?.();
        }
      });
    }
  } catch (e) {
    console.error('Critical error playing sound:', e);
  }
};

// Check if audio files exist
export const checkAudioFiles = async () => {
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

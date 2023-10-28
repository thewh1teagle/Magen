import React, { createContext, useState } from "react";

interface IAudioContext {
    setAudio: (url: string, forcePause?: boolean) => void
    pauseAudio: () => void | undefined
    soundEnabled: boolean
    setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

export const AudioContext = createContext<IAudioContext | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [audio, setAudioState] = useState<HTMLAudioElement | undefined>();
    const [soundEnabled, setSoundEnabled] = useState(false)
  
    const setAudio = (url: string, forcePause?: boolean) => {
      if (!soundEnabled) {
        return;
      }
      if (!forcePause && audio && !audio.paused) {
        // If audio is already playing, do nothing
        return;
      }
  
      if (audio) {
        // If audio exists and is paused, stop it
        audio.pause();
      }
  
      const newAudio = new Audio(url);
      newAudio.play();
      setAudioState(newAudio);
    };
  
    const pauseAudio = () => {
      if (audio) {
        audio.pause();
      }
    };
  
    return <AudioContext.Provider value={{ setAudio, pauseAudio, soundEnabled, setSoundEnabled }}>{children}</AudioContext.Provider>;
  }
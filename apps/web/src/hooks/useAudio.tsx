import { useContext } from "react";
import { AudioContext } from "../providers/AudioProvider";

export const useAudio = () => {
    const context = useContext(AudioContext);
    
    if (!context) {
        if (typeof window === 'undefined') {
            throw new Error("useAudio must be used within an AudioProvider, but no AudioProvider was found.");
        } else {
            throw new Error("useAudio must be used within an AudioProvider.");
        }
    }
    
    return context;
};
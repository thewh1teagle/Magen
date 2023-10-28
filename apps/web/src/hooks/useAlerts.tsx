import { useContext } from "react";
import { AlertsContext } from "../providers/AlertsProvider";

export const useAlerts = () => {
    const context = useContext(AlertsContext);
    
    if (!context) {
        if (typeof window === 'undefined') {
            throw new Error("useAlerts must be used within an AlertsProvider, but no AlertsProvider was found.");
        } else {
            throw new Error("useAudio must be used within an AlertsProvider.");
        }
    }
    
    return context;
};
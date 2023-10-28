import "./App.css";
import FloatingDash from "./components/FloatingDash";
import InteractiveMap from "./components/InteractiveMap";
import { AudioProvider } from "./providers/AudioProvider.tsx";
import { AlertsProvider } from "./providers/AlertsProvider.tsx";

function App() {
  return (
    <AudioProvider>
      <AlertsProvider>
        <div className="w-[100vw] h-[100vh] relative">
          <div className="absolute right-0 bottom-0 text-slate-900 font-bold z-[1000] text-lg p-2 rounded-lg mb-10 mr-3 opacity-90">
            מפת פיקוד העורף
          </div>
          <FloatingDash />
          <InteractiveMap />
        </div>
      </AlertsProvider>
    </AudioProvider>
  );
}

export default App;

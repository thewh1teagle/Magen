import NoSleep from "nosleep.js";
import { ReadyState } from "react-use-websocket";
import { useAudio } from "../hooks/useAudio";
import CurrentDate from "./CurrentDate";
import { useAlerts } from "../hooks/useAlerts";
import CityFilter from "./CityFilter";

const noSleep = new NoSleep();

export default function FloatingDash() {
  const { alerts, readyState, testAlert } = useAlerts();
  const { soundEnabled, setSoundEnabled, pauseAudio } = useAudio();

  return (
    <div className="max-w-[300px] sm:max-h-[30%] sm:overflow-y-auto p-5 bg-black z-[10000] absolute sm:bottom-2 sm:right-[50%] sm:translate-x-[50%] sm:w-[90%] lg:right-[25px] lg:top-[25px] rounded-lg text-white">
      <div className="flex flex-row">
        {[ReadyState.OPEN].includes(readyState) && <CurrentDate />}
        {[ReadyState.CLOSED, ReadyState.CONNECTING].includes(readyState) && (
          <div className="text-red-500 text-center w-full text-3xl">
            אין תקשורת!
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-center pt-1">
        <label className="relative inline-flex items-center cursor-pointer dir-ltr">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={soundEnabled}
            onChange={(event) => {
              if (!event.target.checked) {
                pauseAudio();
              }
              setSoundEnabled(event.target.checked);
              if (event.target.checked) {
                noSleep.enable();
              } else {
                noSleep.disable();
              }
            }}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            השמע צליל התראה
          </span>
        </label>
        <button
          onClick={testAlert}
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-5 py-2.5 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          בדיקה
        </button>
      </div>
      <div className="min-h-[100px] max-h-[200px] rounded-lg overflow-x-hidden scrollbar bg-slate-800 mt-3">
        <h1 className="bg-red-700 w-full rounded-tr-lg rounded-tl-lg py-1 pr-2">
          {alerts.length === 0 ? "אין התרעות פעילות" : "התרעות פעילות"}
        </h1>
        <div className="flex flex-col gap-2 pt-2">
          {alerts.map((alert) => (
            <div
              key={alert.name + alert.timestamp.getTime()}
              className="bg-white text-black rounded-lg p-2 flex flex-row gap-2 items-center justify-between pl-5"
            >
              {alert.is_test ? `**בדיקה** ${alert.name}` : alert.name}
              {alert.threat?.he && (
                <div className="text-xs p-1 bg-red-800 text-white rounded-lg">
                  {alert.threat.he}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <CityFilter />
    </div>
  );
}

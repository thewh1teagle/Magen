import React, { createContext, useState } from "react";
import { useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import alaramSound from ".././assets/alarm.mp3";
import { WS_URL } from "../config";
import { ActiveAlert, City, OrefUpdate, Threat } from "../../../packages/magen_common_ts/src/interfaces";
import { useAudio } from "../hooks/useAudio";
import { citiesJson, threatsJson } from "../../../packages/magen_common_ts/src/lib";
import { useLocalStorage } from 'usehooks-ts'

interface IAlertsContext {
  testAlert: () => void;
  readyState: ReadyState;
  alerts: ActiveAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<ActiveAlert[]>>;
  filters: City[];
  setFilters: React.Dispatch<React.SetStateAction<City[]>>;
}

export const AlertsContext = createContext<IAlertsContext | undefined>(
  undefined
);

function updateAlerts(alerts: Array<ActiveAlert>, lastJsonMessage: OrefUpdate) {
  // get new active alerts based on areas names
  const updatedAlerts: Array<ActiveAlert> = [...alerts]; // deep copy
  
  lastJsonMessage.cities.forEach((city) => {
    const index = updatedAlerts.findIndex((active) => active.name == city);

    if (index !== -1) {
      // exists
      updatedAlerts[index].timestamp = new Date();
    } else {
      // Add a new alert
      const newCityData: City = citiesJson?.[city];
      const threat: Threat | undefined = threatsJson?.[lastJsonMessage.category]
      if (newCityData) {
        updatedAlerts.push({
          name: city,
          timestamp: new Date(),
          city: newCityData,
          threat,
          is_test: lastJsonMessage.is_test ?? false
        });
      } else {
        updatedAlerts.push({
          name: city,
          timestamp: new Date(),
          is_test: lastJsonMessage.is_test ?? false
        });
      }
    }
  });
  return updatedAlerts;
}

function filterAlerts(alerts: Array<ActiveAlert>, filters: Array<City>) {
  return alerts.filter(
    (a) =>
      filters.length === 0 ||
      a.is_test ||
      ( a.city && filters.some(f => f.id == a.city?.id) )
  )
}

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const { setAudio } = useAudio();
  const alertId = useRef<string | null>();
  const [alerts, setAlerts] = useState<Array<ActiveAlert>>([]);
  const [filters, setFilters] = useLocalStorage<Array<City>>('filters', [])

  const { lastJsonMessage, readyState, sendJsonMessage } = useWebSocket<OrefUpdate>(WS_URL, {
    shouldReconnect: () => true,
    reconnectInterval: 1000,
    reconnectAttempts: Infinity,
  });

  function testAlert() {
    sendJsonMessage({action: "test"})
  }

  useEffect(() => {
    // cleart alerts after countdown elapsed
    let intervalId: number;

    function clearAlerts() {
      intervalId = setInterval(() => {
        const newAlerts = alerts.filter((alert) => {
          const countdown = alert.is_test ? 5 : (alert.city?.countdown || 60);
          const elapsedSeconds =
            (new Date().getTime() - alert.timestamp.getTime()) / 1000;
          return elapsedSeconds < countdown;
        });

        if (newAlerts.length === 0) {
          setAlerts([]);
          clearInterval(intervalId);
        } else {
          setAlerts(newAlerts);
        }
      }, 1000);
    }

    clearAlerts();

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [alerts]);


  useEffect(() => {
    if (lastJsonMessage?.cities && lastJsonMessage.id !== alertId.current) {
      alertId.current = lastJsonMessage.id;
      const newAlerts = updateAlerts(alerts, lastJsonMessage);
      const newFiltersAlerts = filterAlerts(newAlerts, filters)
      if (newFiltersAlerts.length > 0) {
        setAudio(alaramSound)
      }
      setAlerts(newFiltersAlerts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage, setAudio]);

  return (
    <AlertsContext.Provider
      value={{ alerts, setAlerts, readyState, testAlert, filters, setFilters }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

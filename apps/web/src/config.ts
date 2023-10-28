export const WS_URL = import.meta.env.DEV
  ? import.meta.env?.VITE_WS_DEV_URL
  : import.meta.env?.VITE_WS_URL;
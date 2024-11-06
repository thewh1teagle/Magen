import { ILogObj, Logger } from "tslog";

const minLevelMap: { [key: string]: number } = {
  silly: 0,
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

const defaultLevel: number = 3;
const logLevel: number =
  minLevelMap[process.env.LOG_LEVEL?.toLowerCase() || "info"] ?? defaultLevel;

const log: Logger<ILogObj> = new Logger({ minLevel: logLevel });

export default log;

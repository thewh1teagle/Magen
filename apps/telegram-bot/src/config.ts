import dotenv from 'dotenv'

dotenv.config()
import {Level} from 'pino'

export const wsURL = process.env.WS_URL!
export const botToken = process.env.BOT_TOKEN!
export const channelID = process.env.CHANNEL_ID!
export const appName = 'Magen-Bot'
export const logLevel: Level = process.env.LOG_LEVEL as Level || 'info'
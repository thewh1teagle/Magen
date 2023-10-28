import dotenv from 'dotenv'

dotenv.config()

export const wsURL = process.env.WS_URL!
export const botToken = process.env.BOT_TOKEN!
export const ChannelID = process.env.CHANNEL_ID!
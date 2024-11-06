import dotenv from "dotenv";

dotenv.config();

export const wsURL = process.env.WS_URL!;
export const botToken = process.env.BOT_TOKEN!;
export const channelID = process.env.CHANNEL_ID!;
export const appName = "Magen-Bot";

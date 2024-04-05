import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export const databaseURL = process.env.DATABASE_URL!
export const wsURL = process.env.WS_URL!
export const host = process.env.HOST ?? '127.0.0.1'
export const port =  process.env.PORT ? parseInt(process.env.PORT) : 3030
export const dbName = 'app'
export const serviceAccountPath = path.join(__dirname, '../service_account.json');
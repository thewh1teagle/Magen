import {FastifyInstance} from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function routes (app: FastifyInstance, options: object) {
    
    interface SetBody {
        cities: string[]
        fcm_token: string
    }
    app.get('/healthcheck', async (req, res) => {
        return res.send({status: 'ok'})
    });
}
import {FastifyInstance} from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function routes (app: FastifyInstance, options: object) {
    
    interface SetBody {
        cities: string[]
        fcm_token: string
    }
    app.post<{ Body: SetBody }>('/set', async (req, res) => {
        console.log('create user ', req.body)
    
        // Use updateOne to perform the upsert
        const fcm_token = req.body.fcm_token
        const cities = req.body.cities.map(c => c)
        await prisma.user.upsert({where: {fcm_token}, create: {fcm_token, cities}, update: {fcm_token, cities}})
        console.log('user created successfuly')
        return res.send({status: 'set'})
    });

    interface UnsetBody {
        fcm_token: string
    }
    app.post<{ Body: UnsetBody }>('/unset', async (req, res) => {
        console.log('remove user ', req.body)
    
        // Use updateOne to perform the upsert
        const fcm_token = req.body.fcm_token
        await prisma.user.delete({where: {fcm_token}})
        console.log('user removed successfuly')
        return res.send({status: 'unset'})
    });
}
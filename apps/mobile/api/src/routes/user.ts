import {FastifyInstance} from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function routes (app: FastifyInstance, options: object) {
    
    interface RegisterBody {
        cities: string[]
        fcm_token: string
    }
    app.post<{ Body: RegisterBody }>('/create', async (req, res) => {
        console.log('create user ', req.body)
    
        // Define the update operation
        const update = {
            $set: {
                cities: req.body.cities.map(c => c),
                fcm_token: req.body.fcm_token
            }
        };    
        // Use updateOne to perform the upsert
        await prisma.user.create({data: {
            fcm_token: req.body.fcm_token,
            cities: req.body.cities.map(c => c),
        }})
    
        console.log('user created successfuly')
        return {status: 'ok'}
    });     
    
    interface UpdateBody extends RegisterBody {
        id: string
    }
    app.post<{Body: UpdateBody}>('/update', async (req, res) => {
        const id = req.body.id
        await prisma.user.update({where: {id}, data: {
            cities: req.body.cities,
            fcm_token: req.body.fcm_token
        }})
        return {status: 'ok'}
    })
}
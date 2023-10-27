import {FastifyInstance} from 'fastify'
import { LatLng } from '../interfaces'

export default async function routes (app: FastifyInstance, options: object) {
    const collection = app!.mongo!.db!.collection('users')

    interface RegisterBody {
        cities: string[]
        fcm_token: string
    }

    app.post<{Body: RegisterBody}>('/create', async (req, res) => {
        return await collection.insertOne({
            cities: req.body.cities,
            fcm_token: req.body.fcm_token
        })
    })
    
    interface UpdateBody extends RegisterBody {
        id: string
    }
    app.post<{Body: UpdateBody}>('/update', async (req, res) => {
        const id = new app.mongo.ObjectId(req.body.id)
        return await collection.updateOne(
            {_id: id}, 
            {"$set": {
                cities: req.body.cities,
                fcm_token: req.body.fcm_token
            }}
        )
    })
}
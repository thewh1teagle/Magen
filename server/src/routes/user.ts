import {FastifyInstance} from 'fastify'
import { LatLng } from '../interfaces'

export default async function routes (app: FastifyInstance, options: object) {
    const collection = app!.mongo!.db!.collection('users')

    interface RegisterBody {
        positions: LatLng[]
        fcm_token: string
    }

    app.post<{Body: RegisterBody}>('/create', async (req, res) => {
        return await collection.insertOne({
            positions: req.body.positions.map(p => ({
                type: 'Point',
                coordinates: [p[0], p[1]]
            })),
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
                positions: req.body.positions.map(p => ({
                    type: 'Point',
                    coordinates: [p[0], p[1]]
                })),
                fcm_token: req.body.fcm_token
            }}
        )
    })
}
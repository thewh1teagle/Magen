import {FastifyInstance} from 'fastify'
import { LatLng } from '../interfaces'

export default async function routes (app: FastifyInstance, options: object) {
    const collection = app!.mongo!.db!.collection('users')

    interface RegisterBody {
        cities: string[]
        fcm_token: string
    }

    app.post<{ Body: RegisterBody }>('/create', async (req, res) => {
    
        // Check if a document with the given fcm_token exists
        const existingDocument = await collection.findOne({ fcm_token: req.body.fcm_token });
    
        if (existingDocument) {
            // If a document with the fcm_token already exists, return an error or appropriate response
            return { message: 'FCM token already exists' };
        } else {
            // Insert the data into the collection because the fcm_token doesn't exist
            await collection.insertOne({
                cities: req.body.cities,
                fcm_token: req.body.fcm_token
            });
            return { message: 'User created successfully' };
        }
    });    
    
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
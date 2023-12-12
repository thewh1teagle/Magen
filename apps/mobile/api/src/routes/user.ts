import {FastifyInstance} from 'fastify'
import { LatLng } from '../../../../packages/magen-common/src/interfaces'

export default async function routes (app: FastifyInstance, options: object) {
    const collection = app!.mongo!.db!.collection('users')

    interface RegisterBody {
        cities: string[]
        fcm_token: string
    }

    app.post<{ Body: RegisterBody }>('/create', async (req, res) => {
    
        // Define the filter to find the document by fcm_token
        const filter = { fcm_token: req.body.fcm_token };
    
        // Define the update operation
        const update = {
            $set: {
                cities: req.body.cities,
                fcm_token: req.body.fcm_token
            }
        };
    
        // Specify the upsert option to insert if not found
        const options = { upsert: true };
    
        // Use updateOne to perform the upsert
        const result = await collection.updateOne(filter, update, options);
    
        if (result.upsertedCount > 0) {
            // If a new document was inserted, return a success message
            return { message: 'User created successfully' };
        } else {
            // If an existing document was updated, return an appropriate response
            return { message: 'User updated successfully' };
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
import { MongoClient, ServerApiVersion } from 'mongodb'
import * as config from './config'
import { LatLng } from '../../../packages/magen-common/src/interfaces';

const client = new MongoClient(
    config.databaseURL,
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    },
)
export const db = client.db(config.dbName)

async function run() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

async function init() {
  await db.createCollection('users')
}


run().catch(console.dir);
init().catch(console.dir)


export async function createUser(fcm_token: string, locations: LatLng[]) {

}
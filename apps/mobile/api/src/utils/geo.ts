import { type FastifyInstance } from 'fastify';
import { Collection, Filter } from 'mongodb';
import { ActiveAlert } from '../../../../packages/magen_common_ts/src/interfaces';
import {User} from '../interfaces'

export async function findUsers(app: FastifyInstance, alerts: Array<ActiveAlert>): Promise<User[] | undefined> {
  const users: Collection<User> = app!.mongo!.db!.collection('users');
  try {
    // Get a reference to the MongoDB 'users' collection
    // Extract city IDs from the alerts
    const citiesIds = alerts.map(a => a.city?.id).flatMap(id => id ? [id.toString()] : [])

    // Find users whose cities match any of the given IDs
    const found = await users.find({ cities: { $in: citiesIds } }).toArray();

    return found;
  } catch (e) {
    console.error(e);
    throw e; // You might want to handle or log the error in a more meaningful way
  }
}



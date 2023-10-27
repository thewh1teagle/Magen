import { type FastifyInstance } from 'fastify';
import { Collection, Filter } from 'mongodb';
import { ActiveAlert, User } from '../interfaces';

export async function findUsers(app: FastifyInstance, alerts: Array<ActiveAlert>): Promise<User[] | undefined> {
    try {
      // Get a reference to the MongoDB 'users' collection
      const users: Collection<User> = app!.mongo!.db!.collection('users');
  
      // Create an array of polygon coordinates from alerts
      const polygons = alerts
        .map(a => a.polygon)
        .filter(p => p !== undefined);
  
      const geoQueries = polygons.map(polygon => {
        if (polygon) {
          return {
            positions: {
              $geoWithin: {
                $geometry: {
                  type: 'Polygon',
                  coordinates: [polygon],
                },
              },
            },
          };
        }
        return null;
      });
  
      // Filter out null values and combine the geo queries with $or
      const combinedQuery: Filter<User> = {
        $or: geoQueries.filter(query => query !== null) as Filter<User>[],
      };
  
      const res = await users.find(combinedQuery);
      const found = await res.toArray();
  
      return found;
    } catch (e) {
      console.error(e);
      throw e; // You might want to handle or log the error in a more meaningful way
    }
  }
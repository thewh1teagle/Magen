import { ActiveAlert } from '@magen/common/src/interfaces';
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export async function findUsers(alerts: Array<ActiveAlert>): Promise<User[] | undefined> {
  try {
    // Get a reference to the MongoDB 'users' collection
    // Extract city IDs from the alerts
    const citiesIds = alerts.map(a => a.city?.id).flatMap(id => String(id) ? [String(id)] : [])

    // if user set one city to 0
    // it will take him always
    // assume it's everywhere in Israel
    citiesIds.push("0") 

    // Find users whose cities match any of the given IDs
    const found = await prisma.user.findMany({where: {cities: {hasSome: citiesIds}}})

    return found;
  } catch (e) {
    console.error(e);
    throw e; // You might want to handle or log the error in a more meaningful way
  }
}



import WebSocket from 'ws';
import * as config from './config'
import { citiesJson, polygonsJson, threatsJson } from './data'
import { ActiveAlert, OrefUpdate } from './interfaces';
import { findUsers } from './utils/geo';
import { FastifyInstance } from 'fastify';

export const socket = new WebSocket(config.wsURL, {
  perMessageDeflate: false
});

export function parseAlerts(update: OrefUpdate): ActiveAlert[] {
  return update.cities.map(city => {
    const cityData = citiesJson?.[city]
    return {
      is_test: update.is_test ?? false,
      name: city,
      timestamp: new Date(),
      threat: threatsJson?.[update.category],
      city: cityData,
      polygon: polygonsJson?.[cityData?.id]
    }
  })
}

export function startListen(app: FastifyInstance) {
  socket.addEventListener('message', async (message) => {
    const update = JSON.parse(message.data as string) as OrefUpdate
    const alerts = parseAlerts(update)
    const users = await findUsers(app, alerts)
    console.log('users => ', users)
  })
}

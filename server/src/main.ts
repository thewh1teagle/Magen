import {parseAlerts, socket} from './ws'
import fastify, {type FastifyInstance} from 'fastify'
import * as config from './config'
import { ActiveAlert, LatLng, OrefUpdate, User } from './interfaces'
import cors from '@fastify/cors'
import userRoute from './routes/user'
import db_connector from './db_connector'
import * as wsClient from './ws'
import { Collection, Filter } from 'mongodb'
import { findUsers } from './utils/geo'
import { sendPush } from './firebase'


sendPush({token: 'eqchRf9ORVi1UCfL8I5xH7:APA91bEZJiTx7uRHadUCy1QIUnZMUp0K3WXVHNHQvtNzOka57ootig3jJczwnA4klnURTzDPPvyOZeeinKPke8K7huqqoTWW1U4wtEuUZTCEGQHyPuqXjZi45T3QyFTqSHKYWWr182a3', data: {hello: 'world'}})
// export const app = fastify({logger: {}})
// app.register(db_connector)
// app.register(cors, {origin: "*", allowedHeaders: "*", methods: "*"})
// app.register(userRoute, {prefix: '/user'})


// app.listen({ port: config.port, host: config.host }, function (err, address) {
//     if (err) {
//       app.log.error(err)
//       process.exit(1)
//     }
//     wsClient.startListen(app)
// })

// Register (id, fcm_token, locations: [])
// Update (id, locations: [])
// for message in ws:
//   get users within latLngs []
//   for user in users:
//     user.send(message)


// UI: clicking the notification
// Display last message


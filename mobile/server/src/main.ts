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


export const app = fastify({logger: {}})
app.register(db_connector)
app.register(cors, {origin: "*", allowedHeaders: "*", methods: "*"})
app.register(userRoute, {prefix: '/user'})


app.listen({ port: config.port, host: config.host }, function (err, address) {
    // app.mongo.db?.dropCollection('users');
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    wsClient.startListen(app)
})


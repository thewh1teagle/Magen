import fastify from 'fastify'
import * as config from './config'
import cors from '@fastify/cors'
import userRoute from './routes/user'
import * as wsClient from './utils/alerts'


export const app = fastify({logger: {}})
app.register(cors, {origin: "*", allowedHeaders: "*", methods: "*"})
app.register(userRoute, {prefix: '/api/user'})


app.listen({ port: config.port, host: config.host }, function (err, address) {
    // app.mongo.db?.dropCollection('users');
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    wsClient.startListen(app)
})


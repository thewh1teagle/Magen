import fastify from 'fastify'
import * as config from './config'
import cors from '@fastify/cors'
import userRoute from './routes/user'
import * as wsClient from './utils/alerts'

export function buildApp() {
    const app = fastify({logger: {}})
    app.register(cors, {origin: "*", allowedHeaders: "*", methods: "*"})
    app.register(userRoute, {prefix: '/api/user'})
    return app
}


import fastify from 'fastify'
import * as config from './config'
import cors from '@fastify/cors'
import userRoute from './routes/user'
import apiRoute from './routes/api'
import * as wsClient from './utils/alerts'

export function buildApp() {
    const app = fastify({logger: {}})
    app.register(cors, {origin: "*", allowedHeaders: "*", methods: "*"})
    app.register(userRoute, {prefix: '/api/user'})
    app.register(apiRoute, {prefix: '/api'})
    return app
}


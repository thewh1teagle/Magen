import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'
import type {FastifyInstance} from 'fastify'
import * as config from './config'

async function dbConnector (app: FastifyInstance, options: object) {
  app.register(fastifyMongo, {
    url: config.databaseURL
  })
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fastifyPlugin(dbConnector)
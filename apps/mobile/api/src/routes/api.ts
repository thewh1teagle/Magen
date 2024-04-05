import {FastifyInstance} from 'fastify'

export default async function routes (app: FastifyInstance, _options: object) {
    app.get('/healthcheck', async (req, res) => {
        return res.send({status: 'ok'})
    });
}
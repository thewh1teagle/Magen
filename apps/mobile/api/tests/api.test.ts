
import {test} from 'tap'
import { describe, it } from 'node:test'
import { buildApp } from '../src/app'


test('api', async (t) => {
    const app = buildApp()

    t.teardown(() => {
        app.close()
    })

    const res = await app.inject({method: 'GET', url: '/'})
    t.equal(res.statusCode, 404)    
})
import { assert } from 'chai'
import {app} from '../src/index'
import { describe, it } from 'node:test'


describe("API tests", () => {
    it("should do something", async () => {
        const res = await app.inject({method: 'GET', url: '/'})
        assert.equal(res.statusCode, 200)
    })
})
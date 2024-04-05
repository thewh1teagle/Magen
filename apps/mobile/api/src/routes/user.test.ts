
import {test} from 'tap'
import { buildApp } from '../app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

test('server running', async (t) => {
    const app = buildApp()
    t.teardown(() => {
        app.close()
    })
    const res = await app.inject({method: 'GET', url: '/'})
    t.equal(res.statusCode, 404)    
})

test('create user', async (t) => {
    const app = buildApp()
    t.teardown(() => {
        app.close()
    })
    // Clear users
    await prisma.user.deleteMany({})
    // Create user
    const newUser = {fcm_token: '123', cities: ['123']}
    const res = await app.inject({method: 'POST', url: '/api/user/set', body: newUser})
    t.equal(res.statusCode, 200)
    const users = await prisma.user.findMany({})
    t.equal(users.length, 1)
    t.equal(users[0].cities[0], newUser.cities[0])
})

test('update user', async (t) => {
    const app = buildApp()
    t.teardown(() => {
        app.close()
    })
    // Clear users
    await prisma.user.deleteMany({})
    // Create user
    const user0 = {fcm_token: '0', cities: ['0']}
    const user1 = {fcm_token: '0', cities: ['1']}
    const res = await app.inject({method: 'POST', url: '/api/user/set', body: user0})
    t.equal(res.statusCode, 200)
    const foundUsers0 = await prisma.user.findMany({})
    
    const res1 = await app.inject({method: 'POST', url: '/api/user/set', body: user1})
    t.equal(res1.statusCode, 200)
    const foundUsers1 = await prisma.user.findMany({})
    t.equal(foundUsers1.length, 1)
    t.notSame(foundUsers0[0].cities[0], foundUsers1[0].cities[0])
})


test('remove user', async (t) => {
    const app = buildApp()
    t.teardown(() => {
        app.close()
    })
    // Clear users
    await prisma.user.deleteMany({})
    // Create user
    const user0 = {fcm_token: '0', cities: ['0']}
    const res = await app.inject({method: 'POST', url: '/api/user/set', body: user0})
    t.equal(res.statusCode, 200)
    const before = await prisma.user.findMany({})
    const res1 = await app.inject({method: 'POST', url: '/api/user/remove', body: {fcm_token: user0.fcm_token}})
    t.equal(res1.statusCode, 200)
    const after = await prisma.user.findMany({})
    t.equal(before.length, 1)
    t.equal(after.length, 0)
})
import {test} from 'tap'
import { buildApp } from '../app'
import { PrismaClient } from '@prisma/client'
import { findUsers } from './geo'
import { ActiveAlert } from '@magen/common/src/interfaces'
import { citiesJson, threatsJson } from '@magen/common'

const prisma = new PrismaClient()

test('find users', async (t) => {
    const app = buildApp()
    t.teardown(() => {
        app.close()
    })

    // Clear users
    await prisma.user.deleteMany({})

    // Create user
    const cityID = "4"
    const newUser = {fcm_token: '123', cities: [cityID]}
    const res = await app.inject({method: 'POST', url: '/api/user/set', body: newUser})
    const correctAlerts: ActiveAlert[] = [{
        is_test: false,
        name: 'אילת',
        timestamp: new Date(),
        city: citiesJson['אילת'],
        threat: threatsJson[cityID]
    }]
    const users = await findUsers(correctAlerts)
    t.equal(users?.length, 1)

    const invalidAlerts: ActiveAlert[] = [{
        is_test: false,
        name: 'blabla',
        timestamp: new Date(),
        city: citiesJson?.['blabla'],
        threat: threatsJson[cityID]
    }]
    const users1 = await findUsers(invalidAlerts)
    t.equal(users1?.length, 0)
})
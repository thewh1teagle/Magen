

import * as config from './config'
import { initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import * as admin from 'firebase-admin'


  
const app = initializeApp({credential: admin.credential.cert(config.serviceAccountPath)});
const fcm = getMessaging()


interface IMessage {
    data: any,
    token: string | Array<string>
}

export async function sendPush(message: IMessage) {
    switch (true) {
        case Array.isArray(message.token): {
            fcm.sendEachForMulticast({tokens: message.token as string[], data: message.data})
            break
        }
        default: {
            console.log('sedning push')
            const res = await fcm.send({token: message.token as string, data: message.data})
            console.log('res => ', res)
        }
    }
}


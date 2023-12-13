import axios from 'axios'
import Config from 'react-native-config'
import {MMKVLoader} from 'react-native-mmkv-storage'
import {interfaces} from '@magen/common'

const api = axios.create({baseURL: Config.API_URL, timeout: 2000})

export async function register(fcmToken: string, cities: interfaces.City[]) {
  console.log('sending register to ', Config.API_URL, fcmToken, cities)
  const resp = await api.post('/user/create', {
    fcm_token: fcmToken,
    cities: cities.map(c => c.id),
  })
  return fcmToken
}

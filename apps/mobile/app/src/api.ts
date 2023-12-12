import axios from 'axios'
import Config from 'react-native-config'
import {MMKVLoader} from 'react-native-mmkv-storage'
import {interfaces} from '@magen/common'

const api = axios.create({baseURL: Config.API_URL})

export async function register(fcmToken: string, cities: interfaces.City[]) {
  const resp = await api.post('/user/create', {
    fcm_token: fcmToken,
    cities: cities.map(c => c.id),
  })
  return fcmToken
}

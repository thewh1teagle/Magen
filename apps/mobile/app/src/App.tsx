import React, { useEffect } from 'react'
import notifee from '@notifee/react-native'
import CityFilter, { citiesArray } from './components/CityFilter'
import HomeScreen from './screens/Home'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { I18nManager } from 'react-native'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as api from './api'
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage'
import { citiesJson, interfaces, threatsJson } from '@magen/common'
import { FcmUpdate } from './interfaces'
import Config from 'react-native-config'
import { City, Threat } from '@magen/common/dist/interfaces'

export const storage = new MMKVLoader().initialize()

interface Update {
  cities: City[]
  thread: Threat
}

async function parseUpdate(rawUpdate: FcmUpdate, filters: City[]) {
  const threat: interfaces.Threat | undefined = threatsJson?.[rawUpdate.threat]
  if (filters.some(f => f.id === 0)) { // everywhere is set, fetch names
    const cities = citiesArray.filter(c => rawUpdate.ids.includes(c.id) && c.id !== 0) // need to use hash table in future
    return {cities, threat}
  } else {
    const cities = filters.filter(f => rawUpdate.ids.includes(f.id))
    return {cities, threat}
  }
}

async function onMessageReceived(message: FirebaseMessagingTypes.RemoteMessage) {
  const filters = await storage.getArrayAsync('filters') as interfaces.City[]
  const rawUpdate = message.data as unknown as FcmUpdate
  const update = await parseUpdate(rawUpdate, filters)
  // update =>  {"ids": "[\"127\",\"737\",\"1304\",\"4\"]", "threat": "1"}
  console.log('update => ', update)

  // const [filters,] = useMMKVStorage<interfaces.City[]>('filters', storage, [])
  // console.log('filters => ', filters)
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  })

  // Display a notification
  await notifee.displayNotification({
    title: `<p style="color: red;"><b>${update.threat.he}</span></p></b></p>`,
    body: `<p style="">${update.cities.map(c => c.he).join(', ')}</i></p>`,
    android: {
      largeIcon: require('./assets/logo.png'),
      channelId,
      color: 'red',
      actions: [
        {
          title: '<b>הצג</b>',
          pressAction: { id: 'dance' },
        },
      ],
    },
  })
}


async function onAppBootstrap() {
  

  // Request permissions (required for iOS)
  await notifee.requestPermission()

  console.log('Bootstraping app...')
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();
  console.log('fcm token is ', token)
  await storage.setString('token', token)
  const filters = await storage.getArrayAsync('filters') as interfaces.City[] | undefined
  if (filters) {
    console.log('registering with fcm token and cities => ', token, filters)
    const res = await api.register(token, filters)
    console.log('res => ', res)
  }
  
  // Save the token
  // await postToApi('/users/1234/tokens', { token });
  messaging().onMessage(onMessageReceived)
  messaging().setBackgroundMessageHandler(onMessageReceived)
  notifee.onBackgroundEvent(async (_) => {}) // just to remove the warning we already handle it
}


const Stack = createNativeStackNavigator();

I18nManager.forceRTL(true)

function App(): JSX.Element {

  useEffect(() => {
    onAppBootstrap()
  }, [])
  return (
    <NavigationContainer>
          <Stack.Navigator initialRouteName='home' screenOptions={{headerShown: false}}>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{ title: '' }}
            />
          </Stack.Navigator>

    </NavigationContainer>
  )
}

export default App

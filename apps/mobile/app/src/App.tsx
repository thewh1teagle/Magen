import React from 'react'
import notifee from '@notifee/react-native'
import CityFilter from './components/CityFilter1'
// import {OrefUpdate} from '../../../packages/magen_common_ts/src/interfaces'
import config from './tamagui.config'
import { TamaguiProvider } from 'tamagui'

async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  })

  // Display a notification
  await notifee.displayNotification({
    title: '<p style="color: red;"><b>🔴 צבע אדום</span></p></b></p>',
    body: '<p style="text-decoration: line-through">נירים</i></p>',
    android: {
      channelId,
      color: 'red',
      actions: [
        {
          title: '<b>הצג</b>',
          pressAction: {id: 'dance'},
        },
      ],
    },
  })
}

function App(): JSX.Element {
  return (
    <TamaguiProvider config={config} defaultTheme='light'>
      <CityFilter />
    </TamaguiProvider>
  )
}

export default App

import React from 'react'
import notifee from '@notifee/react-native'
import CityFilter from './components/CityFilter1'
// import {OrefUpdate} from '../../../packages/magen_common_ts/src/interfaces'
import config from './tamagui.config'
import { TamaguiProvider, Text, View } from 'tamagui'
import Home from './Home'
import { Toast, useToastController, useToastState, ToastProvider, ToastViewport } from '@tamagui/toast'
import CurrentToast from './components/CurrentToast'


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
          pressAction: { id: 'dance' },
        },
      ],
    },
  })
}

function App(): JSX.Element {
  return (
    <TamaguiProvider config={config} defaultTheme='light'>
      <ToastProvider native={false}>
        
        <View h='100%' w='100%' backgroundColor='$blue3Light'>
        <ToastViewport flexDirection="row" justifyContent='center' alignItems='center' bottom={50} w='100%'  />
          <Text fontSize='$4' textAlign='center' marginTop='$5' color='red'>מגן</Text>

          <CityFilter />
          <CurrentToast />

        </View>
      </ToastProvider>
    </TamaguiProvider>
  )
}

export default App

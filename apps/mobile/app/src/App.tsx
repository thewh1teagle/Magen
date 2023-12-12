import React from 'react'
import notifee from '@notifee/react-native'
import CityFilter from './components/CityFilter'
import config from './tamagui.config'
import { TamaguiProvider, Text, View } from 'tamagui'
import HomeScreen from './screens/Home'
import { Toast, useToastController, useToastState, ToastProvider, ToastViewport } from '@tamagui/toast'
import CurrentToast from './components/CurrentToast'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


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

const Stack = createNativeStackNavigator();


function App(): JSX.Element {
  return (
    <NavigationContainer>
      <TamaguiProvider config={config} defaultTheme='light'>
        <ToastProvider native={false}>
          <CurrentToast />
          <ToastViewport flexDirection="row" justifyContent='center' alignItems='center' bottom={50} w='100%' />

          <Stack.Navigator initialRouteName='home'>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{ title: '' }}
            />
          </Stack.Navigator>

        </ToastProvider>
      </TamaguiProvider>
    </NavigationContainer>
  )
}

export default App

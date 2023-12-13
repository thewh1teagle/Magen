import React, { useEffect } from 'react'
import notifee from '@notifee/react-native'
import CityFilter from './components/CityFilter'
import HomeScreen from './screens/Home'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { I18nManager } from 'react-native'
import messaging from '@react-native-firebase/messaging';


async function onMessageReceived() {
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


async function onAppBootstrap() {
  console.log('Bootstraping app...')
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();
  console.log('fcm token is ', token)
  // Save the token
  // await postToApi('/users/1234/tokens', { token });
  messaging().onMessage(onMessageReceived)
  messaging().setBackgroundMessageHandler(onMessageReceived)
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

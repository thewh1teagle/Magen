import React from 'react'
import notifee from '@notifee/react-native'
import CityFilter from './components/CityFilter'
import HomeScreen from './screens/Home'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { I18nManager } from 'react-native'

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

I18nManager.forceRTL(true)

function App(): JSX.Element {

  
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

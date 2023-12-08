import React from 'react'
import {Text, View, Button} from 'react-native'
import LocationSvg from './assets/location.svg'
import notifee from '@notifee/react-native'
import CityFilter from './components/CityFilter'

// import {OrefUpdate} from '../../../packages/magen_common_ts/src/interfaces'

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
    <View>
      <CityFilter />
      <Text>hello</Text>
      <LocationSvg width={100} height={100} />
      <Button
        title="display notification"
        onPress={() => {
          onDisplayNotification()
        }}
      />
    </View>
  )
}

export default App

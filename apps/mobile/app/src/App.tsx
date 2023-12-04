import React from 'react'
import {Text, View} from 'react-native'
import LocationSvg from './assets/location.svg'

function App(): JSX.Element {
  return (
    <View>
      <Text>hello</Text>
      <LocationSvg width={100} height={100} />
    </View>
  )
}

export default App

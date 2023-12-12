// the v2 config imports the css driver on web and react-native on native
// for reanimated: @tamagui/config/v2-reanimated
// for react-native only: @tamagui/config/v2-native
import { config } from '@tamagui/config/v2'
import { Text, View } from 'react-native'
import { createTamagui } from 'tamagui' // or '@tamagui/core'
import { createMedia } from '@tamagui/react-native-media-driver'
import { getTokens } from '@tamagui/core'
import { themes, tokens } from '@tamagui/themes'
import { media } from './media'

const appConfig = createTamagui({
  media,
  themes,
  tokens
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  // or '@tamagui/core'
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
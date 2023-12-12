import {
  citiesJson,
  pointInPolygon,
  polygonsJson,
  interfaces
} from '@magen/common'

import { useMMKVStorage } from 'react-native-mmkv-storage'
import { MMKVLoader } from 'react-native-mmkv-storage'
import { useEffect, useState } from "react"
import { Keyboard, View } from "react-native"

const citiesArray = Object.values(citiesJson)
const storage = new MMKVLoader().initialize()

export default function CityFilter() {
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useMMKVStorage<interfaces.City[]>('filters', storage, [])
  const found = searchValue.length > 1 ? citiesArray.filter(c => c.he.includes(searchValue) && !filters.includes(c)) : []

  function addCity(city: interfaces.City) {
    console.log('calling toast show')
    console.log('adding city', city)
    setFilters([...filters, city])
    setSearchValue('')
    Keyboard.dismiss()
  }

  function removeCity(city: interfaces.City) {
    console.log('adding city', city)
    setFilters(filters.filter(f => f.id !== city.id))
  }

  return (
    <View>
      <View marginTop='$5' paddingHorizontal='$2' position="relative" w='100%' display="flex" justifyContent="center" alignItems="center">

        <Input value={searchValue} onChangeText={setSearchValue} direction="rtl" textAlign="right" placeholder="ישוב" w='100%' />
        <ZStack w='100%'>

          {filters.length === 0 && (
            <View display="flex" flexDirection="row" gap='$2' flexWrap="wrap" marginTop='$3' justifyContent="center">
              <Text fontSize='$3' opacity={0.4} textAlign="center">נא לבחור ישוב</Text>
            </View>
          )}
          <View display="flex" flexDirection="row" gap='$2' flexWrap="wrap" marginTop='$3'>
            {filters.map(f => (
              <View key={f.id} minWidth='$8' minHeight='$3' paddingHorizontal='$2' display="flex" borderRadius='$3' alignItems="center" alignContent="space-around" backgroundColor='$blue1' flexDirection="row" justifyContent="space-between">
                <X size={18} onPress={() => removeCity(f)} />
                <Text fontSize='$3'>{f.he}</Text>
              </View>
            ))}
          </View>
          {
            found.length > 0 && (
              <View shadowColor='#ddd' shadowOffset={{ width: 0, height: 2 }} shadowOpacity={0.3} shadowRadius={4} height='$16' maxHeight='$16' top='100%' position="absolute" w='100%'>
                <ScrollView keyboardShouldPersistTaps='handled' display="flex" flexDirection="column" w='100%'   borderBottomLeftRadius='$4' borderBottomRightRadius='$4'>
                  {found.map(c => (
                    <ListItem onPress={() => addCity(c)} key={c.id}>
                      <Text>{c.he}</Text>
                    </ListItem>
                  ))}
                </ScrollView>

              </View>
            )
          }
          
        </ZStack>

      </View>

    </View>
  )
}
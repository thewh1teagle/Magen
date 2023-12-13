import {
  citiesJson,
  pointInPolygon,
  polygonsJson,
  interfaces
} from '@magen/common'

import { useMMKVStorage } from 'react-native-mmkv-storage'
import { MMKVLoader } from 'react-native-mmkv-storage'
import { useEffect, useState } from "react"
import { Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import Xmark from '../assets/x.svg'
import Button from './Button'
import Input from './Input'

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
  console.log('found => ', found)
  return (
    <View>
      <View className='mt-5 px-2 relative w-full flex justify-center items-center'>

        <Input value={searchValue} onChangeText={setSearchValue} className='w-full' placeholder="ישוב" />
        <View className='w-[100%]'>
          {filters.length === 0 && (
            <View className='flex flex-row gap-2 flex-wrap mt-3 justify-center'>
              <Text className='text-2xl opacity-40 text-center'>נא לבחור ישוב</Text>
            </View>
          )}
          <View className='flex flex-row gap-2 flex-wrap mt-3'>
            {filters.map(f => (
              <View key={f.id} className='min-w-[8] min-h-[3] px-4 py-2 flex rounded-2xl align-middle bg-light-neutral  flex-row items-center'>
                <Xmark className='' width={20} height={20} onPress={() => removeCity(f)} />
                <Text className='ml-2 text-md text-light-neutral-content'>{f.he}</Text>
              </View>
            ))}
          </View>
          {
            found.length > 0 && (
              <ScrollView keyboardShouldPersistTaps='handled' className='flex flex-col w-[100%] max-h-[200] absolute top-[0] bg-light-neutral text-light-neutral-content z-10 rounded-b-lg rounded-t-sm overflow-y-auto'>
                <View className='flex flex-col'>
                  {found.map(c => (
                    <View key={c.id}>
                      <TouchableOpacity key={c.id} onPress={() => addCity(c)}>
                        <Text className='m-2'>{c.he}</Text>
                      </TouchableOpacity>
                      <View className='w-full h-[0.4] bg-light-base-300' />
                    </View>
                  ))}
                </View>
              </ScrollView>
            )
          }

        </View>

      </View>

    </View>
  )
}
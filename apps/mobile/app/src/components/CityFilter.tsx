/* eslint-disable */
import { useEffect, useState } from 'react'
import {
  citiesJson,
  pointInPolygon,
  polygonsJson,
} from 'magen-common'
import { useMMKVStorage } from 'react-native-mmkv-storage'
import { MMKVLoader } from 'react-native-mmkv-storage'

import { Button, Text, View, ScrollView, TextInput, TouchableOpacity, Touchable, Keyboard } from 'react-native'
import { interfaces } from 'magen-common'
import { ChevronRight, Moon, Star } from '@tamagui/lucide-icons'

const citiesArray = Object.values(citiesJson)
const storage = new MMKVLoader().initialize()

export default function CityFilter() {
  const [searchValue, setSearchValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [filters, setFilters] = useMMKVStorage<interfaces.City[]>('filters', storage, [])
  const onFocus = () => setFocused(true)
  const onBlur = () => {
    setTimeout(() => {
      setFocused(false)
    }, 300)
  }
  const found = citiesArray.filter(
    c =>
      searchValue !== '' &&
      c.he.startsWith(searchValue) &&
      !filters.includes(c),
  )



  console.log('filters => ', filters)
  return (
    <View style={{padding: 10}}>
      <Text style={{textAlign: 'center', fontSize: 45}}>מגן</Text>
      <View style={{display: 'flex', flexDirection: 'row', gap: 3, marginTop: 20}}>
        <TouchableOpacity style={{backgroundColor: 'blue', height: 35, paddingHorizontal: 25, borderRadius: 25, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onPress={() => setSearchValue('')}><Text>נקה</Text></TouchableOpacity>
        <View style={{position: 'relative', flex: 1}}>
          <TextInput
            style={{padding: 0, borderStyle: 'solid', borderWidth: 3, borderColor: 'gray'}}
            textAlign='right'
            value={searchValue}
            onFocus={onFocus}
            // onBlur={onBlur}
            onChangeText={setSearchValue}
            id="input-group-1"
            placeholder="שם יישוב..."
          />
          <View>
            {filters.map(f => (
              <TouchableOpacity onPress={() => setFilters(filters.filter(i => i.id !== f.id))}  key={f.id}>
                <Text>{f.he}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {found.length > 0 && (
            <ScrollView keyboardShouldPersistTaps='handled' style={{zIndex: 1, backgroundColor: '#fafafa', position: 'absolute', top: 35, width: '100%', overflow: 'scroll', maxHeight: 400, display: 'flex', flexDirection: 'column'}}>
              {found.map(c => (
                <TouchableOpacity 
                  style={{padding: 10}}
                  onPress={() => {
                  setFilters([...filters, c])
                    Keyboard.dismiss()
                  setSearchValue('')
                }}  key={c.id}><Text style={{color: 'black'}}>{c.he}</Text></TouchableOpacity>
              ))}
          
            </ScrollView>
          )}

        </View>
      </View>

    </View>
  )
}

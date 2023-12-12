import { Button, Text, View } from "tamagui";
import CityFilter from "../components/CityFilter";

export default function Home() {
    return (
        <View h='100%' w='100%' backgroundColor='$blue1'>
        <Text fontSize='$4' textAlign='center' marginTop='$5' color=''>בחר ישוב</Text>
        <CityFilter />
      </View>
    )
}
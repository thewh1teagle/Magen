import { Text, View } from "react-native";
import CityFilter from "../components/CityFilter";

export default function Home() {
    return (
        <View className="h-[100vh] w-[100vw] bg-blue-500">
        <Text className="text-lg text-center mt-5">בחר ישוב</Text>
        <CityFilter />
      </View>
    )
}
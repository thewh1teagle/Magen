import { Text, View } from "react-native";
import CityFilter from "../components/CityFilter";

export default function Home() {
    return (
        <View className="h-[100vh] w-[100vw] bg-light-base-100 text-light-primary">
        <Text className="text-2xl text-center mt-5 text-light-base-content font-bold">בחר ישוב</Text>
        <CityFilter />
      </View>
    )
} 
import { Text, ScrollView } from "tamagui";

export default function ScrollTest() {
    
    return (
        <ScrollView backgroundColor='white' height='100px' maxHeight='100px' width='100%'>
            {new Array(1000).fill(null).map((e, index) => (
                <Text onPress={() => {console.log('pressed', index)}} key={index} color='red'>hello world!</Text>
            ))}
        </ScrollView>
    )
}
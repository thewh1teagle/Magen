import { useImperativeHandle, useRef, useState } from "react";
import { Keyboard, TextInput, TextInputProps } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

interface InputProps extends TextInputProps {

}

export default function Input(props: InputProps) {
    const [carretHidden, setCarretHidden] = useState(true)

    return (
        <TouchableWithoutFeedback className="absolute w-[100vw] h-[100vh]" onPressOut={() => console.log('touchable without fire')}>
        <TextInput placeholderTextColor='#AAAAAA' caretHidden={carretHidden} className="bg-transparent border border-spacing-1 rounded-2xl text-light-neutral py-3 text-sm h-[48px] px-[16px]" {...props} 
        />
        </TouchableWithoutFeedback>

    )
}
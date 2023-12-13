import {TouchableOpacity, TouchableOpacityProps, Text} from 'react-native'

interface ButtonProps extends TouchableOpacityProps {

}

export default function Button(props: ButtonProps) {
    if (typeof props.children === 'string') {
        return (
            <TouchableOpacity 
            onPressOut={() => console.log('press out')}
            onPressIn={() => {
                console.log('press in')
            }} className='bg-light-primary  text-light-primary-content text-center flex items-center justify-center rounded-lg h-[48px] px-[16px] text-sm' {...props}>
                <Text>{props.children}</Text>
            </TouchableOpacity>    
        )
    }
    return (
        <TouchableOpacity className='bg-purple-300 text-white' {...props} />
    )
}
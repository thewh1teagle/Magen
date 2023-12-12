import { Toast, useToastState } from "@tamagui/toast"
import { YStack } from "tamagui"

export default function CurrentToast() {
    const currentToast = useToastState()
  
    if (!currentToast || currentToast.isHandledNatively) return null
    return (
      <Toast
        key={currentToast.id}
        duration={currentToast.duration}
        enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
        exitStyle={{ opacity: 0, scale: 1, y: -20 }}
        y={0}
        opacity={1}
        scale={1}
        animation="medium"
        viewportName={currentToast.viewportName}
      >
        <YStack>
          <Toast.Title fontSize='$3'>{currentToast.title}</Toast.Title>
          {!!currentToast.message && (
            <Toast.Description>{currentToast.message}</Toast.Description>
          )}
        </YStack>
      </Toast>
    )
  }
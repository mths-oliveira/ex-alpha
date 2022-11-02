import { ModalProps, Center, Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"

const animationDuration = 200
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const [display, setDisplay] = useState<"none" | "flex">("none")
  useEffect(() => {
    if (isOpen) {
      setDisplay("flex")
    } else {
      setTimeout(() => {
        setDisplay("none")
      }, animationDuration)
    }
  }, [isOpen])
  return (
    <Center
      bg="rgba(0,0,0,0.5)"
      position="fixed"
      zIndex={10}
      inset="0"
      onClick={onClose}
      display={display}
    >
      <Flex
        animation={`${animationDuration}ms forwards scale-${
          isOpen ? "in" : "out"
        }`}
        flexDirection="column"
        bg="primary"
        overflowY="auto"
        height={["100%", "calc(100% - 7rem)"]}
        maxWidth="25rem"
        width="100%"
        borderRadius="md"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {children}
      </Flex>
    </Center>
  )
}

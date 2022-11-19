import { Flex, List } from "@chakra-ui/react"
import { useRef, useEffect, ReactNode } from "react"
import { MdArrowBack } from "react-icons/md"
import { IconButton } from "../../components/icon-button"
import { IconInput } from "../../components/icon-input"
import { Modal } from "../../components/modal"
import { debounce } from "../../utils/debounce"

export interface ModalProps<T = any> {
  isOpen: boolean
  onClose: () => void
  onSelect?: (data: T) => void
}

interface SeacrhModalProps extends ModalProps {
  placeholder: string
  onInput: (value: string) => void
  children: ReactNode
}

export function SearchModal({
  isOpen,
  onClose,
  children,
  placeholder,
  onInput,
}: SeacrhModalProps) {
  const inputRef = useRef<HTMLInputElement>()
  useEffect(() => {
    if (!isOpen) return
    setTimeout(() => {
      inputRef.current.focus()
    }, 200)
  }, [isOpen])
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Flex padding="2rem 1rem">
        <IconButton icon={MdArrowBack} marginX="0.5rem" onClick={onClose} />
        <IconInput
          inputRef={inputRef}
          placeholder={placeholder}
          onChange={debounce((e) => {
            onInput(e.target.value)
          })}
        />
      </Flex>
      <List
        overflowY="auto"
        position="relative"
        height="100%"
        sx={{
          "&>li": {
            width: "100%",
            bg: "primary",
            transition: "top 0.3s",
            animation: "0.3s forwards slade-in",
            position: "absolute",
            paddingX: "1rem",
            cursor: "pointer",
            _hover: {
              bg: "secondary",
            },
          },
        }}
      >
        {children}
      </List>
    </Modal>
  )
}

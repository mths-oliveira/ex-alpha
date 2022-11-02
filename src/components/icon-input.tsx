import { Flex, Icon, Input, InputProps } from "@chakra-ui/react"
import { MutableRefObject } from "react"
import { MdSearch } from "react-icons/md"

interface IconInputProps extends InputProps {
  inputRef?: MutableRefObject<HTMLInputElement>
}

export function IconInput({ display, inputRef, ...rest }: IconInputProps) {
  return (
    <Flex
      flex={1}
      bg="secondary"
      align="center"
      paddingY="0.25rem"
      borderRadius="md"
      display={display}
    >
      <Input
        ref={inputRef}
        bg="transparent"
        border="none"
        textTransform="capitalize"
        _focus={{ boxShadow: "none" }}
        _placeholder={{
          textTransform: "initial",
          fontSize: "14px",
        }}
        {...rest}
      />
      <Icon as={MdSearch} fontSize="1.5rem" marginRight="1rem" />
    </Flex>
  )
}

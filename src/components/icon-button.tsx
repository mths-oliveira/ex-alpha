import {
  Center,
  CenterProps,
  Icon,
  ComponentWithAs,
  IconProps,
} from "@chakra-ui/react"
import { IconType } from "react-icons/lib"

interface IconButtonProps extends CenterProps {
  icon: IconType | ComponentWithAs<"svg", IconProps>
}

export function IconButton({
  icon,
  fontSize = "1.5rem",
  ...rest
}: IconButtonProps) {
  return (
    <Center
      as="button"
      width="3rem"
      height="3rem"
      borderRadius="md"
      flexShrink="0"
      {...rest}
    >
      <Icon as={icon} fontSize={fontSize} />
    </Center>
  )
}

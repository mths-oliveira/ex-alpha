import { Flex } from "@chakra-ui/react"
import { NavBar } from "../components/navbar"

export function Footer() {
  return (
    <Flex
      display={["flex", "none"]}
      as="footer"
      gridArea="footer"
      borderTop="sm"
      borderColor="tertiary"
      position="sticky"
      bottom="0"
      bg="primary"
    >
      <NavBar justifyContent="space-evenly" alignItems="center" />
    </Flex>
  )
}

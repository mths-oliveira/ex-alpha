import { Box, Flex, Image } from "@chakra-ui/react"
import { NavBar } from "../components/navbar"

export function Aside() {
  return (
    <Flex
      as="aside"
      width="15rem"
      borderRight="sm"
      borderColor="tertiary"
      height="100vh"
      position="fixed"
      top="0"
      flexDir="column"
      display={["none", "flex"]}
    >
      <Box as="header" padding="3.5rem">
        <Image margin="auto" src="favicon.png" />
      </Box>
      <NavBar flexDir="column" />
    </Flex>
  )
}

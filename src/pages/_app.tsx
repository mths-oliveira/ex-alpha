import {
  Box,
  ChakraProvider,
  Flex,
  Grid,
  Image,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import { theme } from "../styles/theme"
import { AppProps } from "next/app"
import { IconButton } from "../components/icon-button"
import { MdDarkMode, MdOutlineLightMode, MdSearch } from "react-icons/md"
import { NavBar } from "../components/navbar"

export default function MyApp({ Component, pageProps }: AppProps) {
  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <ChakraProvider theme={theme}>
      <Grid
        height="100vh"
        gridColumnGap={["0", "4rem"]}
        justifyContent="space-between"
        gridTemplateRows={["3.5rem 1fr 4rem", "3.5rem 1fr 0"]}
        gridTemplateColumns={["1fr", "15rem 1fr 0"]}
        gridTemplateAreas={[
          `"header" "main" "footer"`,
          `"aside header" "aside main" "aside footer"`,
        ]}
      >
        <Flex
          as="header"
          gridArea="header"
          borderBottom="sm"
          borderColor="tertiary"
          alignItems="center"
          justifyContent="space-between"
          position="sticky"
          top="0"
          zIndex="10"
          bg="primary"
          paddingX={["0.25rem", "0"]}
        >
          <IconButton
            icon={colorMode === "light" ? MdDarkMode : MdOutlineLightMode}
            onClick={toggleColorMode}
          />
          <Image
            src="favicon.png"
            height="3rem"
            display={["initial", "none"]}
          />
          <IconButton icon={MdSearch} onClick={() => {}} />
        </Flex>
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
        <Stack
          as="main"
          gridArea="main"
          paddingY={["3.5rem", "4rem"]}
          spacing={["3.5rem", "4rem"]}
        >
          <Component {...pageProps} />
        </Stack>
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
      </Grid>
    </ChakraProvider>
  )
}

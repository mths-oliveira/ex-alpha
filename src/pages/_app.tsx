import { ChakraProvider, Grid } from "@chakra-ui/react"
import { theme } from "../styles/theme"
import { AppProps } from "next/app"
import { Header } from "../layout/header"
import { Aside } from "../layout/aside"
import { Footer } from "../layout/footer"
import { Main } from "../layout/main"
import { TimezoneModal } from "../layout/modal/timezone"
import { CurrencyModal } from "../layout/modal/currency"

import {
  TimezoneContextProvider,
  useTimezoneContext,
} from "../contexts/timezone"
import {
  CurrencyContextProvider,
  useCurrencyContext,
} from "../contexts/currency"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <TimezoneContextProvider>
        <CurrencyContextProvider>
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
            <Header />
            <Aside />
            <Main>
              <Component {...pageProps} />
            </Main>
            <Footer />
          </Grid>
          <Modal />
        </CurrencyContextProvider>
      </TimezoneContextProvider>
    </ChakraProvider>
  )
}

function Modal() {
  const timezoneModal = useTimezoneContext()
  const currencyModal = useCurrencyContext()
  return (
    <>
      <TimezoneModal
        isOpen={timezoneModal.isOpen}
        onClose={timezoneModal.onClose}
        onSelect={timezoneModal.setTimezone}
      />
      <CurrencyModal
        isOpen={currencyModal.isOpen}
        onClose={currencyModal.onClose}
        onSelect={currencyModal.setCurrency}
      />
    </>
  )
}

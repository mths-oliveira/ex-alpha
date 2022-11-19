import { IconButton } from "../components/icon-button"
import { MdDarkMode, MdOutlineLightMode, MdSearch } from "react-icons/md"
import { Flex, Image, useColorMode } from "@chakra-ui/react"
import { useTimezoneContext } from "../contexts/timezone"
import { useCurrencyContext } from "../contexts/currency"
import { useEffect } from "react"

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const { toggleColorMode, colorMode } = useColorMode()
  const timezoneModal = useTimezoneContext()
  const currencyModal = useCurrencyContext()

  return (
    <Flex
      as="header"
      gridArea="header"
      borderBottom="sm"
      borderColor="tertiary"
      alignItems="center"
      justifyContent="space-between"
      position="sticky"
      top="0"
      zIndex="5"
      bg="primary"
      paddingX={["0.25rem", "0"]}
    >
      <IconButton
        icon={colorMode === "light" ? MdDarkMode : MdOutlineLightMode}
        onClick={toggleColorMode}
      />
      <Image src="favicon.png" height="3rem" display={["initial", "none"]} />
      <IconButton
        icon={MdSearch}
        onClick={() => {
          const pathname = window?.location.pathname || ""
          const isTimezone = pathname === "/aulas" || pathname === "/horarios"
          isTimezone ? timezoneModal.onToggle() : currencyModal.onToggle()
        }}
      />
    </Flex>
  )
}

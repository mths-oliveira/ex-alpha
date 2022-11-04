import {
  List,
  ListItem,
  ListProps,
  Text,
  useBreakpointValue,
  Stack,
  StackProps,
  Flex,
} from "@chakra-ui/react"

import Router from "next/router"
import {
  MdCalculate,
  MdCalendarToday,
  MdMonetizationOn,
  MdOutlineCalculate,
  MdOutlineCalendarToday,
  MdOutlineMonetizationOn,
  MdOutlineSchedule,
  MdSchedule,
} from "react-icons/md"
import { debounce } from "../utils/debounce"

interface NavBarProps extends ListProps {}

export function NavBar({ children, ...rest }: NavBarProps) {
  const isMobile = useBreakpointValue([true, false])
  return (
    <Flex as="nav" width="100%">
      <List display="flex" width="100%" {...rest}>
        <ListItem>
          <MenuItem>
            {true ? <MdCalculate /> : <MdOutlineCalculate />}
            <Text>{isMobile ? "Calcular" : "Calcular Pacote"}</Text>
          </MenuItem>
        </ListItem>
        <ListItem>
          <MenuItem hash="precos">
            {true ? <MdMonetizationOn /> : <MdOutlineMonetizationOn />}
            <Text>{isMobile ? "Preços" : "Tabela de Preços"}</Text>
          </MenuItem>
        </ListItem>
        <ListItem>
          <MenuItem pathname="/aulas">
            {true ? <MdCalendarToday /> : <MdOutlineCalendarToday />}
            <Text>{isMobile ? "Agendar" : "Agendar Aulas"}</Text>
          </MenuItem>
        </ListItem>
        <ListItem>
          <MenuItem pathname="/aulas" hash="horarios">
            {true ? <MdSchedule /> : <MdOutlineSchedule />}
            <Text>{isMobile ? "Horários" : "Tabela de Horários"}</Text>
          </MenuItem>
        </ListItem>
      </List>
    </Flex>
  )
}

interface MenuItemProps extends StackProps {
  pathname?: string
  hash?: string
}

export function MenuItem({ pathname = "/", hash, ...rest }: MenuItemProps) {
  return (
    <Stack
      onClick={() => {
        if (window.location.pathname === pathname) {
          window.location.hash = hash || ""
        } else {
          Router.push({ pathname, hash })
        }
      }}
      spacing={["0.25rem", "1rem"]}
      direction={["column", "row"]}
      alignItems="center"
      padding={["0.5rem", "1rem 1.5rem"]}
      width="100%"
      cursor="pointer"
      _hover={{
        bg: ["initial", "secondary"],
      }}
      sx={{
        "&>p": {
          whiteSpace: "nowrap",
          fontSize: ["12px", "1rem"],
        },
        "&>svg": {
          fontSize: "1.25rem",
        },
      }}
      {...rest}
    />
  )
}

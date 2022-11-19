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
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  MdCalendarToday,
  MdMonetizationOn,
  MdOutlineAccessTimeFilled,
  MdOutlineCalendarToday,
  MdOutlineMonetizationOn,
  MdOutlineSchedule,
  MdOutlineShoppingCart,
  MdShoppingCart,
} from "react-icons/md"

interface NavBarProps extends ListProps {}

export function NavBar({ children, ...rest }: NavBarProps) {
  const isMobile = useBreakpointValue([true, false])
  const [pathname, setPathname] = useState("/")

  return (
    <Flex
      as="nav"
      width="100%"
      ref={(ref) => {
        if (!ref) return
        setPathname(window.location.pathname)
      }}
    >
      <List display="flex" width="100%" {...rest}>
        <ListItem>
          <MenuItem pathname="/" isSelected={pathname === "/"}>
            {pathname === "/" ? (
              <MdMonetizationOn />
            ) : (
              <MdOutlineMonetizationOn />
            )}
            <Text>{isMobile ? "Preços" : "Tabela de Preços"}</Text>
          </MenuItem>
        </ListItem>
        <ListItem>
          <MenuItem pathname="/carrinho" isSelected={pathname === "/carrinho"}>
            {pathname === "/carrinho" ? (
              <MdShoppingCart />
            ) : (
              <MdOutlineShoppingCart />
            )}
            <Text>{isMobile ? "Carrinho" : "Carrinho de Compras"}</Text>
          </MenuItem>
        </ListItem>
        <ListItem>
          <MenuItem pathname="/horarios" isSelected={pathname === "/horarios"}>
            {pathname === "/horarios" ? (
              <MdOutlineAccessTimeFilled />
            ) : (
              <MdOutlineSchedule />
            )}
            <Text>{isMobile ? "Horários" : "Tabela de Horários"}</Text>
          </MenuItem>
        </ListItem>
        <ListItem>
          <MenuItem pathname="/aulas" isSelected={pathname === "/aulas"}>
            {pathname === "/aulas" ? (
              <MdCalendarToday />
            ) : (
              <MdOutlineCalendarToday />
            )}
            <Text>{isMobile ? "Agendar" : "Agendar Aulas"}</Text>
          </MenuItem>
        </ListItem>
      </List>
    </Flex>
  )
}

interface MenuItemProps extends StackProps {
  pathname: string
  isSelected: boolean
}

export function MenuItem({ pathname, isSelected, ...rest }: MenuItemProps) {
  return (
    <Link href={pathname}>
      <Stack
        color="altText"
        spacing={["0.25rem", "1rem"]}
        direction={["column", "row"]}
        alignItems="center"
        padding={["0.5rem", "1rem 1.5rem"]}
        width="100%"
        cursor="pointer"
        data-selected={isSelected ? true : null}
        _hover={{
          color: "text",
        }}
        _selected={{
          bg: ["initial", "secondary"],
          color: "text",
        }}
        sx={{
          "&>p": {
            whiteSpace: "nowrap",
            fontSize: ["12px", "14px"],
          },
          "&>svg": {
            fontSize: "1.25rem",
          },
        }}
        {...rest}
      />
    </Link>
  )
}

import { useDisclosure } from "@chakra-ui/react"
import Cookies from "js-cookie"
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react"
import { DisclosureProps } from "."
import { Timezone } from "../backend/models/timezone"

interface Context extends DisclosureProps {
  timezone: Timezone
  setTimezone: (timezone: Timezone) => void
}

const TimezoneContext = createContext({} as Context)

interface Props {
  children: ReactNode
}

export function TimezoneContextProvider({ children }: Props) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const [timezone, setTimezone] = useState<Timezone>()
  useEffect(() => {
    if (!timezone) return
    Cookies.set("timezone-id", timezone.id)
  }, [timezone])
  return (
    <TimezoneContext.Provider
      value={{ isOpen, onClose, setTimezone, timezone, onToggle }}
    >
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezoneContext(initialTimezone?: Timezone) {
  const context = useContext(TimezoneContext)
  if (!context.timezone) context.timezone = initialTimezone
  return context
}

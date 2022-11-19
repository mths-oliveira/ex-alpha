import { useDisclosure } from "@chakra-ui/react"
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react"
import { DisclosureProps } from "."
import { Currency } from "../backend/models/currency"

import Cookies from "js-cookie"

interface Context extends DisclosureProps {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext({} as Context)

interface Props {
  children: ReactNode
}

export function CurrencyContextProvider({ children }: Props) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const [currency, setCurrency] = useState<Currency>()
  useEffect(() => {
    if (!currency) return
    Cookies.set("currency-code", currency.code)
  }, [currency])
  return (
    <CurrencyContext.Provider
      value={{ isOpen, onClose, currency, setCurrency, onToggle }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrencyContext(initialCurrency?: Currency) {
  const context = useContext(CurrencyContext)
  if (!context.currency) context.currency = initialCurrency
  return context
}

import { Box, Flex, ListItem, Text } from "@chakra-ui/react"
import { useState } from "react"
import { ModalProps, SearchModal } from "."
import {
  CurrencyController,
  currencyData,
} from "../../backend/controllers/currency"
import { createCurrency, Currency } from "../../backend/models/currency"
import { FlagImage } from "../../components/flag-image"
import { removeAccent } from "../../utils/remove-accent"

const currencyController = new CurrencyController()
const currencies = currencyController.listAllCurrencies()

interface CurrencyModalProps extends ModalProps<Currency> {}

export function CurrencyModal({
  onSelect,
  isOpen,
  onClose,
}: CurrencyModalProps) {
  const [query, setQuery] = useState("")
  const regexp = RegExp(removeAccent(query), "i")
  function filter(currency: currencyData): boolean {
    return Boolean(
      regexp.exec(currency.code) ||
        regexp.exec(removeAccent(currency.name)) ||
        regexp.exec(removeAccent(currency.country))
    )
  }
  const filteredCurrencies = currencies.filter(filter)
  return (
    <SearchModal
      isOpen={isOpen}
      onClose={onClose}
      placeholder="País, Código ou Nome da Moeda"
      onInput={setQuery}
    >
      <>
        {filteredCurrencies.map((currency, i) => (
          <ListItem
            key={currency.code}
            top={`${i * 4}rem`}
            onClick={async () => {
              const newCurrency = await createCurrency(currency.code)
              onSelect(newCurrency)
              onClose()
            }}
          >
            <Flex alignItems="center">
              <FlagImage country={currency.country} />
              <Box marginLeft="1rem">
                <Text>{currency.name}</Text>
                <Text fontSize="14px" fontWeight="600" color="altText">
                  {currency.code}
                </Text>
              </Box>
            </Flex>
          </ListItem>
        ))}
      </>
    </SearchModal>
  )
}

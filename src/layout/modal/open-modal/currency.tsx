import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react"
import { MdKeyboardArrowDown } from "react-icons/md"
import { Currency } from "../../../backend/models/currency"
import { FlagImage } from "../../../components/flag-image"
import { useCurrencyContext } from "../../../contexts/currency"

interface Props {
  initialCurrency: Currency
}

export function OpenCurrencyModal({ initialCurrency }: Props) {
  const { currency, onToggle } = useCurrencyContext(initialCurrency)
  return (
    <Stack spacing="0.75rem">
      <Box>
        <Text color="altText" fontSize="14px" marginLeft={["1rem", "0"]}>
          Selecione a moeda para conversão
        </Text>
      </Box>
      <Flex justifyContent="space-between" alignItems="end">
        <Flex
          marginX={["1rem", "0"]}
          border="sm"
          borderColor="tertiary"
          borderRadius="md"
          width="fit-content"
          alignItems="center"
          padding={["0.5rem 1rem", "0.5rem 1.5rem"]}
          cursor="pointer"
          _hover={{
            bg: "secondary",
          }}
          onClick={onToggle}
        >
          <Icon
            as={MdKeyboardArrowDown}
            fontSize="1.5rem"
            marginLeft="-0.25rem"
            marginRight={["0.75rem", "1.25rem"]}
          />
          <Flex alignItems="center">
            <FlagImage country={currency.country} />
            <Box marginLeft="1rem">
              <Text>{currency.name}</Text>
              <Text fontSize="14px" color="altText" fontWeight="600">
                {currency.code}
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Stack>
  )
}

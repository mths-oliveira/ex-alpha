import { Box, Flex, Icon, Stack, Text } from "@chakra-ui/react"
import { MdKeyboardArrowDown } from "react-icons/md"
import { Timezone } from "../../../backend/models/timezone"
import { FlagImage } from "../../../components/flag-image"
import { useTimezoneContext } from "../../../contexts/timezone"

interface Props {
  initialTimezone: Timezone
}

export function OpenTimezoneModal({ initialTimezone }: Props) {
  const { timezone, onToggle } = useTimezoneContext(initialTimezone)
  return (
    <Stack spacing="0.75rem">
      <Text color="altText" fontSize="14px" marginLeft={["1rem", "0"]}>
        Selecione o Fuso Horário para conversão
      </Text>
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
          {timezone && (
            <Flex alignItems="center">
              <FlagImage country={timezone.country} />
              <Box marginLeft="1rem">
                <Text>{timezone.name}</Text>
                <Text fontSize="14px" color="altText" fontWeight="600">
                  {timezone.offsetName}
                </Text>
              </Box>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Stack>
  )
}

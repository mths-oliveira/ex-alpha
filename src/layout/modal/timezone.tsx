import { Box, Flex, ListItem, Text } from "@chakra-ui/react"
import { useState } from "react"
import { ModalProps, SearchModal } from "."
import { TimezonesController } from "../../backend/controllers/timezones"
import { Timezone } from "../../backend/models/timezone"
import { FlagImage } from "../../components/flag-image"
import { removeAccent } from "../../utils/remove-accent"

const timezonesController = new TimezonesController()
const timezones = timezonesController.findAll().sort((current, next) => {
  if (current.offset === next.offset) {
    return current.name > next.name ? 1 : -1
  }
  return current.offset > next.offset ? 1 : -1
})

interface TimezoneModalProps extends ModalProps<Timezone> {}

export function TimezoneModal({
  onSelect,
  isOpen,
  onClose,
}: TimezoneModalProps) {
  const [query, setQuery] = useState("")
  const regexp = RegExp(removeAccent(query), "i")
  function filter(timezone: Timezone): boolean {
    if (query.match(/GMT?/i) || query.match(/[-:+\d]/)) {
      return timezone.offsetName.includes(query.toUpperCase())
    }
    return Boolean(
      regexp.exec(removeAccent(timezone.name)) ||
        regexp.exec(removeAccent(timezone.country))
    )
  }
  const filteredTimezones = timezones.filter(filter)
  return (
    <SearchModal
      isOpen={isOpen}
      onClose={onClose}
      placeholder="País, Cidade ou Fuso Horário"
      onInput={setQuery}
    >
      <>
        {filteredTimezones.map((timezone, i) => (
          <ListItem
            key={timezone.id}
            top={`${i * 4}rem`}
            onClick={async () => {
              onSelect(timezone)
              onClose()
            }}
          >
            <Flex alignItems="center">
              <FlagImage country={timezone.country} />
              <Box marginLeft="1rem">
                <Text>{timezone.name}</Text>
                <Text fontSize="14px" fontWeight="600" color="altText">
                  {timezone.offsetName}
                </Text>
              </Box>
            </Flex>
          </ListItem>
        ))}
      </>
    </SearchModal>
  )
}

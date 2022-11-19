import {
  Box,
  Heading,
  Stack,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { Timezone, TimezoneImp } from "../backend/models/timezone"
import { Table } from "../components/table"
import { GetServerSideProps } from "next"
import { useTimezoneContext } from "../contexts/timezone"
import { ClassesController } from "../backend/controllers/classes"
import { OpenTimezoneModal } from "../layout/modal/open-modal/timezone"

interface Props {
  initialTimezone: Timezone
}

const classesController = new ClassesController()

export default function ({ initialTimezone }: Props) {
  const { timezone } = useTimezoneContext(initialTimezone)
  classesController.setOffset(timezone.offset)
  const classes = classesController.findAllClasses()

  return (
    <Stack spacing="3.5rem">
      <OpenTimezoneModal initialTimezone={initialTimezone} />
      <Stack spacing="1.5rem" id="precos">
        <Box>
          <Heading fontSize="1.5rem" marginX={["1rem", "0"]}>
            Tabela de Horários
          </Heading>
        </Box>
        <Box
          padding={["0", "1rem"]}
          border="sm"
          borderColor={["transparent", "tertiary"]}
          borderRadius="md"
        >
          <Table>
            <TableCaption>
              Horas em que começam a primeira e a última aula do Live no horário
              de {timezone.name}, {timezone.country}.
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Turma</Th>
                <Th>De</Th>
                <Th>Às</Th>
              </Tr>
            </Thead>
            <Tbody>
              {classes.map(({ name, firstHour, lastHour }) => (
                <Tr key={name}>
                  <Td width="100%">{name}</Td>
                  <Td isNumeric>{firstHour}</Td>
                  <Td isNumeric>{lastHour}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Turma</Th>
                <Th>De</Th>
                <Th>Às</Th>
              </Tr>
            </Tfoot>
          </Table>
        </Box>
      </Stack>
    </Stack>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const id = ctx.req.cookies["timezone-id"] || "America/Sao_Paulo"
  const { country, offset, name, offsetName } = new TimezoneImp(id)
  return {
    props: {
      initialTimezone: {
        country,
        id,
        name,
        offset,
        offsetName,
      },
    },
  }
}

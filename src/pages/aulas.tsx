import {
  Box,
  Flex,
  Heading,
  Icon,
  List,
  ListItem,
  Stack,
  StackProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import { useEffect, useState, ReactNode } from "react"
import { Timezone, TimezoneImp } from "../backend/models/timezone"
import { Modal } from "../components/modal"
import { RadioCard } from "../components/radio-card"
import { RadioGroup } from "../components/radio-group"
import { useTimezoneContext } from "../contexts/timezone"
import { OpenTimezoneModal } from "../layout/modal/open-modal/timezone"
import { IconButton } from "../components/icon-button"
import { MdCalendarToday, MdClose } from "react-icons/md"
import {
  ClassesController,
  DayPeriod,
  Weekday,
} from "../backend/controllers/classes"

interface FormControlProps extends StackProps {
  children: ReactNode
  isVisible?: boolean
}

function FormControl({ children, isVisible, ...rest }: FormControlProps) {
  return (
    <Stack
      spacing="1rem"
      animation="300ms forwards slade-in"
      display={isVisible ? "flex" : "none"}
      {...rest}
    >
      {children}
    </Stack>
  )
}

interface Props {
  initialTimezone: Timezone
}

interface Data {
  times: number
  hours: string
  weekday?: Weekday
  dayPeriod?: DayPeriod
}

const initailData: Data = {
  times: 0,
  hours: "",
  weekday: undefined,
  dayPeriod: undefined,
}

const brasilia = new TimezoneImp("America/Sao_Paulo")
const classesController = new ClassesController()
export default function ({ initialTimezone }: Props) {
  const { timezone } = useTimezoneContext(initialTimezone)
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(initailData)
  const weekdays = classesController.findWeekdaysByTimes()
  const periods = classesController.findDayPeriodsByClassName()
  const hours = classesController.findHoursByDayPeriod()
  function clear() {
    classesController.setClassName(undefined)
    classesController.setDayPeriod(undefined)
    classesController.setTimes(0)
    setData(initailData)
    const inputs: HTMLInputElement[] = document.getElementsByName(
      "times"
    ) as any
    inputs.forEach((input) => {
      input.checked = false
      input.parentElement.removeAttribute("data-checked")
    })
  }
  useEffect(() => {
    const form = document.getElementById("form-classes")
    const { bottom } = form.getBoundingClientRect()
    window.scrollTo({
      top: bottom,
      behavior: "smooth",
    })
  }, [data])
  useEffect(() => {
    classesController.setOffset(timezone.offset)
    clear()
  }, [timezone])
  useEffect(() => {
    for (const { className, weekday } of weekdays) {
      if (classesController.className === className) {
        setData((data) => {
          return {
            ...data,
            weekday,
          }
        })
      }
    }
  }, [data.dayPeriod])
  return (
    <>
      <Stack spacing="3.5rem" paddingBottom={["0", "3.5rem"]} id="form-classes">
        <OpenTimezoneModal initialTimezone={initialTimezone} />
        <Stack
          as="form"
          width="100%"
          maxWidth="30rem"
          spacing="3.5rem"
          padding={["1rem", "0"]}
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <Stack spacing="1.5rem">
            <Heading fontSize="1.5rem">Simule o agendamento do Live</Heading>
            <Box fontSize="14px" color="altText">
              <Text>
                Escolha a melhor opção de dia e horário para o referido. A
                simulação das aulas está no horário {timezone.name},{" "}
                {timezone.country}.
              </Text>
            </Box>
          </Stack>
          <Stack spacing="2.25rem" fontSize="14px">
            <FormControl isVisible>
              <Text color="altText">
                Quantas vezes por semana gostaria de estudar?
              </Text>
              <RadioGroup
                name="times"
                onChange={(value) => {
                  const times = Number(value)
                  setData((data) => {
                    return {
                      ...data,
                      times,
                    }
                  })
                  classesController.setTimes(times)
                }}
              >
                <RadioCard value="1" id="1-time">
                  1 vez
                </RadioCard>
                <RadioCard value="2" id="2-times">
                  2 vezes
                </RadioCard>
              </RadioGroup>
            </FormControl>
            <FormControl isVisible={!!data.times}>
              <Text color="altText">
                Quais dias da semana fica melhor para você?
              </Text>
              <RadioGroup
                name="weekdays"
                onChange={(weekday: any) => {
                  setData((data) => {
                    return {
                      ...data,
                      weekday,
                    }
                  })
                }}
              >
                {weekdays.map(({ className, weekday }) => {
                  return (
                    <RadioCard
                      value={weekday}
                      id={weekday}
                      key={className}
                      onClick={() => {
                        classesController.setClassName(className)
                      }}
                    >
                      {weekday}
                    </RadioCard>
                  )
                })}
              </RadioGroup>
            </FormControl>
            <FormControl isVisible={!!data.weekday}>
              <Text color="altText">
                Qual período do dia fica melhor para você?
              </Text>
              <RadioGroup
                name="period"
                onChange={(dayPeriod: any) => {
                  setData((data) => {
                    return {
                      ...data,
                      dayPeriod,
                    }
                  })
                  classesController.setDayPeriod(dayPeriod)
                }}
              >
                {periods.map((period) => (
                  <RadioCard
                    value={period}
                    id={period}
                    key={period}
                    textTransform="capitalize"
                  >
                    {period}
                  </RadioCard>
                ))}
              </RadioGroup>
            </FormControl>
            <FormControl isVisible={!!data.dayPeriod}>
              <Text color="altText">Qual horário fica melhor para você?</Text>
              <RadioGroup
                name="hours"
                onChange={(hours: any) => {
                  setData((data) => {
                    return {
                      ...data,
                      hours,
                    }
                  })
                }}
              >
                {hours.map((hours) => (
                  <RadioCard key={hours} value={hours} id={hours}>
                    {hours}
                  </RadioCard>
                ))}
              </RadioGroup>
            </FormControl>
          </Stack>
          <FormControl
            isVisible={!!data.hours}
            direction={["column-reverse", "row"]}
            paddingTop="1rem"
          >
            <Box
              as="button"
              width="100%"
              padding="1rem 1.5rem"
              bg="secondary"
              borderRadius="md"
              fontWeight="600"
              fontSize="14px"
              textAlign="center"
              onClick={clear}
            >
              Limpar
            </Box>
            <Box
              as="button"
              width="100%"
              padding="1rem 1.5rem"
              bg="blue"
              color="#fff"
              borderRadius="md"
              fontWeight="600"
              fontSize="14px"
              textAlign="center"
              onClick={() => {
                setIsOpen(true)
              }}
            >
              Ver resultado
            </Box>
          </FormControl>
        </Stack>
      </Stack>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        height={["100%", "fit-content"]}
      >
        <IconButton
          icon={MdClose}
          position="absolute"
          top="0.25rem"
          right="0.25rem"
          onClick={() => {
            setIsOpen(false)
          }}
        />
        <Flex flexDir="column" bg="primary" padding="3.5rem 2.25rem">
          <Flex justifyContent="center" marginBottom="3.5rem">
            <Icon as={MdCalendarToday} fontSize="3.5rem" />
          </Flex>
          <Text color="altText" fontSize="14px" marginBottom="0.75rem">
            Aulas no horário de:
          </Text>
          <Tabs isFitted>
            <TabList color="altText">
              <Tab
                _selected={{
                  color: "text",
                  borderColor: "blue",
                }}
              >
                {brasilia.name}
              </Tab>
              <Tab
                display={timezone.name === brasilia.name ? "none" : "flex"}
                _selected={{
                  color: "text",
                  borderColor: "blue",
                }}
              >
                {timezone.name}
              </Tab>
            </TabList>
            <TabPanels marginY="2.25rem">
              <TabPanel padding="0">
                <List
                  paddingX="1rem"
                  listStyleType="initial"
                  sx={{
                    "&>li:not(:first-of-type)": {
                      marginTop: "0.5rem",
                    },
                  }}
                >
                  <ListItem>
                    {data.times} {data.times > 1 ? "vezes" : "vez"} na semana
                  </ListItem>
                  <ListItem>
                    {formatWeekday(classesController.findWeekdayByClassName())}
                  </ListItem>
                  <ListItem>
                    Da{" "}
                    {classesController.findDayPeriodByHour(
                      TimezoneImp.convertTime(data.hours, -180, timezone.offset)
                    )}
                  </ListItem>
                  <ListItem>
                    Às{" "}
                    {TimezoneImp.convertTime(data.hours, -180, timezone.offset)}
                    h
                  </ListItem>
                </List>
              </TabPanel>
              <TabPanel
                padding="0"
                display={timezone.name === brasilia.name ? "none" : "flex"}
              >
                <List
                  paddingX="1rem"
                  listStyleType="initial"
                  sx={{
                    "&>li:not(:first-of-type)": {
                      marginTop: "0.5rem",
                    },
                  }}
                >
                  <ListItem>
                    {data.times} {data.times > 1 ? "vezes" : "vez"} na semana
                  </ListItem>
                  <ListItem>{formatWeekday(data.weekday)}</ListItem>
                  <ListItem>Da {data.dayPeriod}</ListItem>
                  <ListItem>Às {data.hours}h</ListItem>
                </List>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Text color="altText" fontSize="14px">
            As aulas da plataforma estão no fuso horário de {brasilia.name},
            mas, acontecerão para o referido no fuso horário de {timezone.name}.
          </Text>
        </Flex>
      </Modal>
    </>
  )
}

function formatWeekday(weekdays: string) {
  if (!weekdays) return ""
  if (["Sábado", "Domigo"].includes(weekdays)) return weekdays
  return weekdays
    .split(" e ")
    .map((day) => day + "-feira")
    .join(" e ")
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const id = ctx.req.cookies["timezone-id"] || "America/Sao_Paulo"
  const { country, name, offset, offsetName } = new TimezoneImp(id)
  return {
    props: {
      initialTimezone: { country, id, name, offset, offsetName },
    },
  }
}

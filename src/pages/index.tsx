import {
  Box,
  Button,
  Flex,
  FlexProps,
  FormLabel,
  Grid,
  Icon,
  List,
  ListItem,
  Radio,
  RadioGroup,
  SimpleGrid,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import {
  ProductName,
  ProductsController,
} from "../backend/controllers/products"
import { currencyMask } from "../utils/currency-mask"
import { CurrencyController } from "../backend/controllers/currency"
import { createCurrency, Currency } from "../backend/models/currency"
import { GetServerSideProps } from "next"
import { useState, useEffect, useRef } from "react"

import {
  MdArrowBack,
  MdKeyboardArrowDown,
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdSearch,
} from "react-icons/md"
import { FlagImage } from "../components/flag-image"
import { Modal } from "../components/modal"
import { IconButton } from "../components/icon-button"
import { IconInput } from "../components/icon-input"
import Cookies from "js-cookie"
import { removeAccent } from "../utils/remove-accent"
import { debounce } from "../utils/debounce"

interface CardProps extends FlexProps {}

function Card({ title, children }: CardProps) {
  return (
    <Flex
      padding={["1rem", "1.5rem"]}
      flexShrink="0"
      borderRadius="md"
      flexDir="column"
      justifyContent="space-between"
      height={["10rem", "12.5rem"]}
      border="sm"
      borderColor="tertiary"
      width={["15rem", "100%"]}
    >
      <Text color="altText">{title}</Text>
      <Text fontSize={["1.25rem", "1.5rem"]} alignSelf="end">
        {children}
      </Text>
    </Flex>
  )
}

type SalesName =
  | "Strike"
  | "Wol + Live"
  | "Mult Wol"
  | "Wol"
  | "Mult Wol + Live"

const sales: Record<SalesName, ProductName[]> = {
  Wol: ["wol"],
  "Mult Wol": ["wol", "multWol"],
  "Wol + Live": ["wol", "live"],
  "Mult Wol + Live": ["wol", "multWol", "live"],
  Strike: ["wol", "multWol", "live", "multLive"],
}

function getCurrencyName(currency: string) {
  const currencyName = Number(2)
    .toLocaleString("pt-BR", {
      currency,
      style: "currency",
      currencyDisplay: "name",
    })
    .replace("2,00", "")
  return currencyName
}

const productsController = new ProductsController()
const products = productsController.findAll()
const currencyController = new CurrencyController()
const currencies = currencyController.listAllCurrencies()
interface Props {
  initialCurrency: Currency
}
export default function ({ initialCurrency }: Props) {
  const { isOpen, onClose, onToggle } = useDisclosure()
  const { toggleColorMode, colorMode } = useColorMode()
  const [salesName, setSalesName] = useState<SalesName>("Wol")
  const payments = productsController.findPayments(sales[salesName])
  const [currency, setCurrency] = useState<Currency>(initialCurrency)
  useEffect(() => {
    Cookies.set("currency-code", currency.code)
  }, [currency])
  return (
    <>
      <Grid
        height="100vh"
        gridGap={["0", "4rem"]}
        justifyContent="space-between"
        gridTemplateRows={["4rem 1fr 4rem", "4rem 1fr 0"]}
        gridTemplateColumns={["1fr", "15rem 1fr 0"]}
        gridTemplateAreas={[
          `"header" "main" "footer"`,
          `"aside header" "aside main" "aside footer"`,
        ]}
      >
        <Flex
          as="header"
          gridArea="header"
          borderBottom="sm"
          borderColor="tertiary"
          alignItems="center"
          justifyContent="space-between"
          position="sticky"
          top="0"
          zIndex="10"
          bg="primary"
          paddingX={["0.25rem", "0"]}
        >
          <IconButton
            icon={
              colorMode === "light" ? MdOutlineDarkMode : MdOutlineLightMode
            }
            onClick={toggleColorMode}
          />
          <IconButton icon={MdSearch} onClick={onToggle} />
        </Flex>
        <Flex
          as="aside"
          gridArea="aside"
          borderRight="sm"
          borderColor="tertiary"
        ></Flex>
        <Box as="main" gridArea="main">
          <RadioGroup
            defaultValue="Wol"
            display="flex"
            onChange={setSalesName as any}
            maxWidth="100vw"
          >
            <Flex
              overflow="auto"
              marginBottom={["0", "1rem"]}
              paddingBottom="0.5rem"
              padding={["1rem", "0"]}
            >
              {Object.keys(sales).map((name) => (
                <FormLabel
                  flexShrink={0}
                  marginRight="1rem"
                  _last={{
                    marginRight: 0,
                  }}
                  key={name}
                  htmlFor={name}
                  padding="0.5rem 1rem"
                  borderRadius="full"
                  border="sm"
                  borderColor="tertiary"
                  cursor="pointer"
                  fontSize="14px"
                  _hover={{
                    bg: "secondary",
                  }}
                  data-selected={name === salesName ? true : null}
                  _selected={{
                    bg: "text",
                    color: "primary",
                  }}
                >
                  <Text>{name}</Text>
                  <Radio display="none" id={name} value={name} />
                </FormLabel>
              ))}
            </Flex>
          </RadioGroup>

          <Flex
            overflow="auto"
            marginBottom="2.25rem"
            paddingBottom="1.5rem"
            maxWidth="100vw"
          >
            <SimpleGrid
              columns={3}
              gridGap={["1rem", "1.5rem"]}
              flexShrink="0"
              flexGrow="1"
              paddingX={["1rem", "0"]}
            >
              {payments.map(({ month, value }) => (
                <Card title={month} key={month}>
                  {currency.symbol} {currencyMask(value / currency.value)}
                </Card>
              ))}
            </SimpleGrid>
          </Flex>

          <Flex
            marginX={["1rem", "0"]}
            border="sm"
            borderColor="tertiary"
            borderRadius="md"
            marginBottom="1.5rem"
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
          <Box
            padding={["0", "1rem"]}
            border="sm"
            borderColor={["transparent", "tertiary"]}
            borderRadius="md"
          >
            <Table
              sx={{
                "*>tr>th": {
                  color: "altText",
                },
                "&>caption": {
                  color: "text",
                },
                "&>caption, *>tr>*": {
                  padding: ["1rem", "1rem 1.5rem"],
                },
                "&>*>tr>*": {
                  borderColor: "tertiary",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableCaption>
                Valor da Taxa de Matrícula e Mensalidades em{" "}
                {getCurrencyName(currency.code)}
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Matrícula</Th>
                  <Th>Mensalidade</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map(({ name, monthlyPayment, enrolmentFee }) => (
                  <Tr key={name}>
                    <Td width="100%">{name}</Td>
                    <Td isNumeric>
                      {currencyMask(enrolmentFee / currency.value)}
                    </Td>
                    <Td isNumeric>
                      {currencyMask(monthlyPayment / currency.value)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Matrícula</Th>
                  <Th>Mensalidade</Th>
                </Tr>
              </Tfoot>
            </Table>
          </Box>
        </Box>
        <Flex
          as="footer"
          gridArea="footer"
          borderTop="sm"
          borderColor="tertiary"
          position="sticky"
          bottom="0"
          bg="primary"
        ></Flex>
      </Grid>
      <CurrencyModal
        isOpen={isOpen}
        onClose={onClose}
        setCurrency={setCurrency}
      />
    </>
  )
}

interface CurrencyModalProps {
  isOpen: boolean
  onClose: () => void
  setCurrency: (currency: Currency) => void
}

function CurrencyModal({ isOpen, onClose, setCurrency }: CurrencyModalProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>()
  const regexp = RegExp(removeAccent(query), "i")
  useEffect(() => {
    if (!isOpen) return
    setTimeout(() => {
      inputRef.current.focus()
    }, 200)
  }, [isOpen])
  function filter(currency: Currency): boolean {
    return Boolean(
      regexp.exec(currency.code) ||
        regexp.exec(removeAccent(currency.name)) ||
        regexp.exec(removeAccent(currency.country))
    )
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Flex padding="2rem 1rem">
        <IconButton icon={MdArrowBack} marginX="0.5rem" onClick={onClose} />
        <IconInput
          inputRef={inputRef}
          placeholder="País, Código ou Nome da Moeda"
          onChange={debounce((e) => {
            setQuery(e.target.value)
          })}
        />
      </Flex>
      <List overflowY="auto" position="relative" height="100%">
        {currencies.filter(filter).map((currency, i) => (
          <ListItem
            width="100%"
            bg="primary"
            transition="top 0.3s"
            animation="0.3s forwards slade-in"
            position="absolute"
            top={`${i * 4}rem`}
            key={currency.code}
            paddingX="1rem"
            cursor="pointer"
            _hover={{
              bg: "secondary",
            }}
            onClick={async () => {
              const newCurrency = await createCurrency(currency.code)
              setCurrency(newCurrency)
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
      </List>
    </Modal>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const code = ctx.req.cookies["currency-code"] || "BRL"
  const initialCurrency = await createCurrency(code)
  return {
    props: {
      initialCurrency,
    },
  }
}

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import { ReactNode, useEffect, useState } from "react"
import { Modal } from "../components/modal"
import { RadioCard } from "../components/radio-card"
import { RadioGroup } from "../components/radio-group"
import { IconButton } from "../components/icon-button"
import {
  MdCalendarToday,
  MdClose,
  MdOutlineMonetizationOn,
  MdOutlineShoppingCart,
  MdShoppingCart,
} from "react-icons/md"
import { createCurrency, Currency } from "../backend/models/currency"
import { OpenCurrencyModal } from "../layout/modal/open-modal/currency"
import { currencyMask } from "../utils/currency-mask"
import {
  MonthlyPayments,
  Product,
  ProductId,
  ProductsController,
} from "../backend/controllers/products"
import { useCurrencyContext } from "../contexts/currency"
import { getCurrencyName } from "."
import { Table } from "../components/table"

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
  initialCurrency: Currency
}

const initialSelectedProducts: Record<ProductId, boolean> = {
  wol: undefined,
  multWol: undefined,
  live: undefined,
  multLive: undefined,
}

export default function ({ initialCurrency }: Props) {
  const { currency } = useCurrencyContext(initialCurrency)
  const productsController = new ProductsController(currency.value)
  const [selectedProducts, setSelectedProducts] = useState(
    initialSelectedProducts
  )
  const [isOpen, setIsOpen] = useState(false)
  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayments[]>([])
  const productsData: Record<ProductId, Product> = {
    wol: productsController.getProductById("wol"),
    multWol: productsController.getProductById("multWol"),
    live: productsController.getProductById("live"),
    multLive: productsController.getProductById("multLive"),
  }
  const [refs, setRefs] = useState<HTMLParagraphElement[]>([])
  function addRef(ref: HTMLParagraphElement) {
    if (!ref || refs.includes(ref)) return
    setRefs((refs) => [...refs, ref])
  }
  useEffect(() => {
    setTimeout(setWidth, 200)
  }, [isOpen])
  function setWidth() {
    let rest = [...refs]
    let major: HTMLParagraphElement = rest.shift()
    for (const ref of rest) {
      ref.style.width = `${major.clientWidth}px`
    }
  }
  return (
    <>
      <Stack spacing="3.5rem" paddingBottom={["0", "3.5rem"]} id="form">
        <OpenCurrencyModal initialCurrency={initialCurrency} />
        <Stack
          as="form"
          width="100%"
          maxWidth="30rem"
          spacing="3.5rem"
          padding={["1rem", "0"]}
          onSubmit={(e) => {
            e.preventDefault()
            const products = []
            for (const productId in selectedProducts) {
              if (selectedProducts[productId]) {
                const product = productsData[productId]
                products.push(product)
              }
            }
            const monthlyPayments =
              productsController.createMonthlyPaymentsByProducts(products)
            setMonthlyPayments(monthlyPayments)
          }}
        >
          <Stack spacing="1.5rem">
            <Heading fontSize="1.5rem">Carrinho de Compras</Heading>
            <Box fontSize="14px" color="altText">
              <Text>
                Adicione os produtos no carrinho e veja quanto o referido vai
                investir por mês em
                {getCurrencyName(currency.code)}.
              </Text>
            </Box>
          </Stack>
          <Stack spacing="2.25rem" fontSize="14px">
            <FormControl isVisible>
              <Text color="altText">
                Que tal adicionar um perfil por apenas{" "}
                {currencyMask(productsData.wol.monthlyPayment)}{" "}
                {getCurrencyName(currency.code)}?
              </Text>
              <RadioGroup
                name="wol"
                onChange={(value: any) => {
                  setSelectedProducts((selectedProducts) => {
                    const wol = value === "Sim"
                    if (!wol) return initialSelectedProducts
                    return {
                      ...selectedProducts,
                      wol,
                    }
                  })
                }}
              >
                <RadioCard value="Não" id="wol-Não" key="Não">
                  Não
                </RadioCard>
                <RadioCard value="Sim" id="wol-Sim" key="Sim">
                  Sim
                </RadioCard>
              </RadioGroup>
            </FormControl>
            <FormControl isVisible={selectedProducts.wol}>
              <Text color="altText">
                Que tal adicionar um segundo perfil por apenas{" "}
                {currencyMask(productsData.multWol.monthlyPayment)}{" "}
                {getCurrencyName(currency.code)}?
              </Text>
              <RadioGroup
                name="multWol"
                onChange={(value: any) => {
                  setSelectedProducts((selectedProducts) => {
                    return {
                      ...selectedProducts,
                      multWol: value === "Sim",
                    }
                  })
                }}
              >
                <RadioCard value="Não" id="multWol-Não" key="Não">
                  Não
                </RadioCard>
                <RadioCard value="Sim" id="multWol-Sim" key="Sim">
                  Sim
                </RadioCard>
              </RadioGroup>
            </FormControl>
            <FormControl isVisible={selectedProducts.multWol !== undefined}>
              <Text color="altText">
                Quer ter aulas ao vivo com um professor por mais{" "}
                {currencyMask(productsData.live.monthlyPayment)}{" "}
                {getCurrencyName(currency.code)}?
              </Text>
              <RadioGroup
                name="live"
                onChange={(value: any) => {
                  setSelectedProducts((selectedProducts) => {
                    const data = {
                      ...selectedProducts,
                      live: value === "Sim",
                    }
                    if (!data.multWol || !data.live) data.multLive = false
                    return data
                  })
                }}
              >
                <RadioCard value="Não" id="live-Não" key="Não">
                  Não
                </RadioCard>
                <RadioCard value="Sim" id="live-Sim" key="Sim">
                  Sim
                </RadioCard>
              </RadioGroup>
            </FormControl>
            <FormControl
              isVisible={selectedProducts.multWol && selectedProducts.live}
            >
              <Text color="altText">
                Gostaria que o segundo perfil também tivesse aulas ao vivo por
                apenas {currencyMask(productsData.multLive.monthlyPayment)}{" "}
                {getCurrencyName(currency.code)}?
              </Text>
              <RadioGroup
                name="multLive"
                onChange={(value: any) => {
                  setSelectedProducts((selectedProducts) => {
                    return {
                      ...selectedProducts,
                      multLive: value === "Sim",
                    }
                  })
                }}
              >
                <RadioCard value="Não" id="multLive-Não" key="Não">
                  Não
                </RadioCard>
                <RadioCard value="Sim" id="multLive-Sim" key="Sim">
                  Sim
                </RadioCard>
              </RadioGroup>
            </FormControl>
          </Stack>
          <FormControl
            isVisible={Object.values(selectedProducts).every(
              (value) => value !== undefined
            )}
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
        <Flex
          flexDir="column"
          bg="primary"
          padding={["3.5rem 1rem", "3.5rem 2.25rem"]}
        >
          <Flex justifyContent="center" marginBottom="3.5rem">
            <Icon as={MdOutlineMonetizationOn} fontSize="3.5rem" />
          </Flex>
          <Text color="altText" fontSize="14px" marginBottom="1rem">
            Valor a ser pago:
          </Text>
          <Accordion allowToggle>
            {monthlyPayments.map(({ payments, month }, i) => (
              <AccordionItem key={month}>
                <h2>
                  <AccordionButton
                    padding="1rem"
                    _expanded={{
                      borderBottom: "sm",
                      borderColor: "tertiary",
                    }}
                  >
                    <Flex
                      width="100%"
                      justifyContent="space-between"
                      alignItems="center"
                      marginRight="0.5rem"
                    >
                      <Box>
                        <Text fontSize="12px" color="altText">
                          {i === 2 ? "A partir de" : "No mês de"}
                        </Text>
                        <Text>{month}</Text>
                      </Box>
                      <Text className="justify-text" ref={addRef}>
                        {currency.symbol}{" "}
                        {currencyMask(
                          payments.reduce((acc, { value }) => acc + value, 0)
                        )}
                      </Text>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel padding="1rem 0">
                  <Table
                    fontSize="14px"
                    sx={{
                      "*>tr>*": {
                        padding: "1rem",
                      },
                      "tbody>tr:last-of-type>td": {
                        border: "none",
                      },
                    }}
                  >
                    <Tbody>
                      {payments.map(({ name, productName, value }) => (
                        <Tr key={name + productName}>
                          <Td>{name}</Td>
                          <Td width="100%">{productName}</Td>
                          <Td className="justify-text">
                            {currency.symbol} {currencyMask(value)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Flex>
      </Modal>
    </>
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

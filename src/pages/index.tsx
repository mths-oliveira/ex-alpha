import {
  Box,
  Flex,
  Heading,
  Stack,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { ProductsController } from "../backend/controllers/products"
import { currencyMask } from "../utils/currency-mask"
import { createCurrency, Currency } from "../backend/models/currency"
import { GetServerSideProps } from "next"
import { Table } from "../components/table"
import { useCurrencyContext } from "../contexts/currency"
import { OpenCurrencyModal } from "../layout/modal/open-modal/currency"
import { ReactNode, useEffect, useState } from "react"

interface Props {
  initialCurrency: Currency
}

export default function ({ initialCurrency }: Props) {
  const { currency } = useCurrencyContext(initialCurrency)
  const productsController = new ProductsController(currency.value)
  const products = productsController.getAllProducts()
  const [refs, setRefs] = useState<HTMLParagraphElement[]>([])
  function addRef(ref: HTMLParagraphElement) {
    if (!ref || refs.includes(ref)) return
    setRefs((refs) => [...refs, ref])
  }
  useEffect(() => {
    setWidth()
  }, [refs])
  useEffect(setWidth, [currency])
  function setWidth() {
    if (!refs.length) return
    let major: HTMLParagraphElement = refs[4]
    let rest = [...refs]
    rest.splice(4, 1)
    for (const ref of rest) {
      ref.style.width = `${major.clientWidth}px`
    }
  }
  return (
    <Stack spacing="3.5rem">
      <OpenCurrencyModal initialCurrency={initialCurrency} />
      <Stack spacing="1.5rem">
        <Box>
          <Heading fontSize="1.5rem" marginX={["1rem", "0"]}>
            Tabela de Preços
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
                  <Td>
                    <Text className="justify-text" ref={addRef}>
                      {currency.symbol} {currencyMask(enrolmentFee)}
                    </Text>
                  </Td>
                  <Td>
                    <Text className="justify-text" ref={addRef}>
                      {currency.symbol} {currencyMask(monthlyPayment)}
                    </Text>
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
      </Stack>
    </Stack>
  )
}

export function getCurrencyName(currency: string) {
  const currencyName = Number(2).toLocaleString("pt-BR", {
    currency,
    style: "currency",
    currencyDisplay: "name",
  })
  return currencyName.replace(/[\d,]/g, "")
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

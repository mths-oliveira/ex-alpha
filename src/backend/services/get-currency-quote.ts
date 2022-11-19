import { api } from "../../config/api"

const dollarCode = "USD"
const realCode = "BRL"
export async function getCurrencyQuote(
  inputCurrencyCode: string,
  outputCurrencyCode: string = realCode
) {
  if (inputCurrencyCode === outputCurrencyCode) return 1
  if (outputCurrencyCode === dollarCode) {
    const response = await api.get(`${inputCurrencyCode}-${dollarCode}`)
    const bid = Number(response.data[`${inputCurrencyCode}${dollarCode}`].bid)
    return bid
  }
  let url = `${dollarCode}-${outputCurrencyCode}`
  if (inputCurrencyCode !== dollarCode) {
    url += `,${dollarCode}-${inputCurrencyCode}`
  }
  const response = await api.get(url)
  const bid = Number(response.data[`${dollarCode}${outputCurrencyCode}`].bid)
  if (inputCurrencyCode === dollarCode) return bid
  const ask = Number(response.data[`${dollarCode}${inputCurrencyCode}`].bid)
  return bid / ask
}

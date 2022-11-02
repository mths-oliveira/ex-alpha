import currencies from "../database/currencies.json"
import { getCurrencyQuote } from "../services/get-currency-quote"

export interface CurrencyDTO {
  code: string
  name: string
  countries: string[]
}
export interface Currency {
  code: string
  name: string
  symbol: string
  country: string
  value: number
}

export async function createCurrency(code: string): Promise<Currency> {
  const { name, symbol, countries } = currencies[code]
  const value = await getCurrencyQuote(code)
  return {
    code,
    name,
    symbol,
    value,
    country: countries[0],
  }
}

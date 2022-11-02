import currenciesData from "../database/currencies.json"

export interface currencyData {
  code: string
  name: string
  country: string
}

export class CurrencyController {
  listAllCurrencies(): currencyData[] {
    const listCurrencies = Object.keys(currenciesData).map(
      this.fetchCurrencyDataByCode
    )
    return listCurrencies
  }
  fetchCurrencyDataByCode(code: string): currencyData {
    const { countries, name } = currenciesData[code]
    const country = countries[0]
    return {
      code,
      country,
      name,
    }
  }
}

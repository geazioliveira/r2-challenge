import { stockApiConfig } from '../core/config/stockApi.config.ts'
import { globalQuoteMock } from '../core/mocks/global-quote.mock.ts'
import { companyOverviewMock } from '../core/mocks/company-overview.mock.ts'
import type { GlobalQuoteModel } from '../core/models/global-quote.model.ts'
import { globalQuoteTransformation } from '../core/utils/global-quote.transformation.ts'

export default class StockAPI {
  private readonly apiKeys = stockApiConfig.apiKeys
  private readonly baseURL = stockApiConfig.baseURL
  private readonly defaultSymbol = 'MSFT'
  private readonly useMock: boolean = true

  constructor() {
    // this.apiKey = this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]
  }

  async getQuote(symbol: string): Promise<any> {
    if (!symbol) {
      symbol = this.defaultSymbol
    }
    // Use Mock api
    if (this.useMock) {
      return {
        quoteData: globalQuoteMock,
        companyOverview: companyOverviewMock,
      }
    }

    // Use real API
    console.log(`Fetching data for ${symbol} from API`)
    try {
      const quoteData = await this.fetchQuoteData(symbol)
      const companyOverview = await this.fetchCompanyOverview(symbol)

      console.log(quoteData, companyOverview)
      return { quoteData, companyOverview }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  private async fetchQuoteData(symbol: string): Promise<GlobalQuoteModel> {
    const url = `${this.baseURL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.getApiKey()}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status)
    }

    return globalQuoteTransformation(await response.json())
  }

  private async fetchCompanyOverview(symbol: string) {
    try {
      const url = `${this.baseURL}?function=OVERVIEW&symbol=${symbol}&apikey=${this.getApiKey()}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status)
      }

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  }

  private getApiKey() {
    return this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]
  }
}

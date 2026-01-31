import { stockApiConfig } from '../core/config/stockApi.config.ts'
import { globalQuoteMock } from '../core/mocks/global-quote.mock.ts'
import { companyOverviewMock } from '../core/mocks/company-overview.mock.ts'
import type { GlobalQuoteModel } from '../core/models/global-quote.model.ts'
import { globalQuoteTransformation } from '../core/utils/global-quote.transformation.ts'
import type { CompanyOverviewModel } from '../core/models/company-overview.model.ts'
import { companyOverviewTransformation } from '../core/utils/company-overview.transformation.ts'

export default class StockAPI {
  private readonly apiKeys = stockApiConfig.apiKeys
  private readonly baseURL = stockApiConfig.baseURL
  private readonly defaultSymbol = 'MSFT'
  private readonly useMock: boolean = true

  constructor() {
    // this.apiKey = this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]
  }

  /**
   * Fetches the quote and company overview data for a given symbol.
   * If no symbol is provided, the default symbol will be used.
   * It can fetch data either from a mock API or a real API, depending on the configuration.
   *
   * @param {string} symbol - The stock symbol to fetch data for.
   * @return {Promise<{quoteData: GlobalQuoteModel, companyOverview: CompanyOverviewModel}>} A promise that resolves with the quote data and company overview.
   * @throws Will throw an error if data fetching fails.
   */
  async getQuote(symbol: string): Promise<{
    globalQuote: GlobalQuoteModel
    companyOverview: CompanyOverviewModel
  }> {
    if (!symbol) {
      symbol = this.defaultSymbol
    }
    // Use Mock api
    if (this.useMock) {
      return {
        globalQuote: globalQuoteMock,
        companyOverview: companyOverviewMock,
      }
    }

    // Use real API
    console.log(`Fetching data for ${symbol} from API`)
    try {
      const quoteData = await this.fetchQuoteData(symbol)
      const companyOverview = await this.fetchCompanyOverview(symbol)

      console.log(quoteData, companyOverview)
      return { globalQuote: quoteData!, companyOverview: companyOverview! }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /**
   * Fetches quote data for the given stock symbol from an external API.
   *
   * @param {string} symbol - The stock symbol for which to retrieve the quote data.
   * @return {Promise<GlobalQuoteModel | undefined>} A promise that resolves to the quote data transformed into a `GlobalQuoteModel`.
   * @throws {Error} Throws an error if the HTTP response status is not OK.
   */
  private async fetchQuoteData(
    symbol: string,
  ): Promise<GlobalQuoteModel | undefined> {
    const url = `${this.baseURL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.getApiKey()}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status)
    }

    return globalQuoteTransformation(await response.json())
  }

  /**
   * Fetches the company overview for a given stock symbol.
   *
   * @param {string} symbol - The stock symbol for the company whose overview is to be fetched.
   * @return {Promise<CompanyOverviewModel | undefined>} A promise that resolves to the transformed company overview data.
   */
  private async fetchCompanyOverview(
    symbol: string,
  ): Promise<CompanyOverviewModel | undefined> {
    try {
      const url = `${this.baseURL}?function=OVERVIEW&symbol=${symbol}&apikey=${this.getApiKey()}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status)
      }

      return companyOverviewTransformation(await response.json())
    } catch (error) {
      console.log(error)
    }
  }

  private getApiKey() {
    return this.apiKeys[Math.floor(Math.random() * this.apiKeys.length)]
  }
}

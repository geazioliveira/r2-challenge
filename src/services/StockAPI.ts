import { stockApiConfig } from '../core/config/stockApi.config.ts'
import type { GlobalQuoteModel } from '../core/models/global-quote.model.ts'
import { globalQuoteTransformation } from '../core/utils/global-quote.transformation.ts'
import type { CompanyOverviewModel } from '../core/models/company-overview.model.ts'
import { companyOverviewTransformation } from '../core/utils/company-overview.transformation.ts'

export interface StockAPIConfig {
  apiKey?: string
  useMock?: boolean
}

export interface StockData {
  globalQuote: GlobalQuoteModel
  companyOverview: CompanyOverviewModel
}

export default class StockAPI {
  private readonly baseURL = stockApiConfig.baseURL
  private readonly defaultSymbol = 'MSFT'
  private readonly apiKey: string
  private readonly useMock: boolean

  constructor(config: StockAPIConfig = {}) {
    this.apiKey = config.apiKey || this.getRandomDefaultKey()
    this.useMock = config.useMock ?? false
  }

  /**
   * Fetches the quote and company overview data for a given symbol.
   */
  async getQuote(symbol: string): Promise<StockData> {
    const targetSymbol = symbol || this.defaultSymbol

    if (this.useMock) {
      console.log(`Using Mock Data for ${targetSymbol}`)
      return this.fetchMockData()
    }

    console.log(`Fetching data for ${targetSymbol} from API`)
    try {
      const [globalQuote, companyOverview] = await Promise.all([
        this.fetchQuoteData(targetSymbol),
        this.fetchCompanyOverview(targetSymbol),
      ])

      if (!globalQuote || !companyOverview) {
        throw new Error('Incomplete data received from API')
      }

      return { globalQuote, companyOverview }
    } catch (error) {
      console.error(`Error fetching stock data for ${targetSymbol}:`, error)
      throw error
    }
  }

  private async fetchQuoteData(
    symbol: string,
  ): Promise<GlobalQuoteModel | undefined> {
    const url = this.buildUrl('GLOBAL_QUOTE', symbol)
    const data = await this.fetchJson(url)
    return globalQuoteTransformation(data)
  }

  private async fetchCompanyOverview(
    symbol: string,
  ): Promise<CompanyOverviewModel | undefined> {
    const url = this.buildUrl('OVERVIEW', symbol)
    const data = await this.fetchJson(url)
    return companyOverviewTransformation(data)
  }

  private buildUrl(functionName: string, symbol: string): string {
    return `${this.baseURL}?function=${functionName}&symbol=${symbol}&apikey=${this.apiKey}`
  }

  private async fetchJson(url: string): Promise<any> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const json = await response.json()

    // Check for API limit or error messages often returned by Alpha Vantage
    if (json['Note'] || json['Information']) {
      console.warn('API Message:', json['Note'] || json['Information'])
    }
    if (json['Error Message']) {
      throw new Error(json['Error Message'])
    }

    return json
  }

  private getRandomDefaultKey() {
    const keys = stockApiConfig.apiKeys
    return keys[Math.floor(Math.random() * keys.length)]
  }

  private async fetchMockData(): Promise<StockData> {
    const companyOverview = await this.fetchJson(
      'http://localhost:5173/public/company-overview.data.json',
    )
    const globalQuote = await this.fetchJson(
      'http://localhost:5173/public/global-quote.data.json',
    )

    return {
      globalQuote: globalQuoteTransformation(globalQuote),
      companyOverview: companyOverviewTransformation(companyOverview),
    } as unknown as Promise<StockData>
  }
}

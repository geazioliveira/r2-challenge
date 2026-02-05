import { stockApiConfig } from '../core/config/stockApi.config.ts'
import type { GlobalQuoteModel } from '../core/models/global-quote.model.ts'
import { globalQuoteTransformation } from '../core/utils/global-quote.transformation.ts'
import type { CompanyOverviewModel } from '../core/models/company-overview.model.ts'
import { companyOverviewTransformation } from '../core/utils/company-overview.transformation.ts'
import { ObservabilityManager } from '../core/observability/index.ts'
import { delay } from '../core/utils'

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

    return ObservabilityManager.getInstance().withSpan(
      'stocks.get_quote',
      async (span) => {
        span.setAttribute('symbol', targetSymbol)
        span.setAttribute('mock', this.useMock)

        if (this.useMock) {
          return this.fetchMockData()
        }

        try {
          const globalQuote = await this.fetchQuoteData(targetSymbol)
          await delay(1500)
          const companyOverview = await this.fetchCompanyOverview(targetSymbol)

          if (!globalQuote || !companyOverview) {
            throw new Error('Incomplete data received from API')
          }

          return { globalQuote, companyOverview }
        } catch (error) {
          console.error(`Error fetching stock data for ${targetSymbol}:`, error)
          throw error
        }
      },
    )
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
    return ObservabilityManager.getInstance().withSpan(
      'stocks.fetch_json',
      async (span) => {
        // Avoid logging full URL if it contains API key?
        // Ideally sanitize it, but for simplicity we assume url is safe enough or user key is public
        span.setAttribute('url.full', url.replace(/apikey=[^&]+/, 'apikey=***'))

        const response = await fetch(url)

        span.setAttribute('http.status_code', response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json = await response.json()

        // Check for API limit or error messages often returned by Alpha Vantage
        if (json['Note'] || json['Information']) {
          console.warn('API Message:', json['Note'] || json['Information'])
          span.addEvent('api_message', {
            message: json['Note'] || json['Information'],
          })
        }
        if (json['Error Message']) {
          throw new Error(json['Error Message'])
        }

        return json
      },
    )
  }

  private getRandomDefaultKey() {
    const keys = stockApiConfig.apiKeys
    return keys[Math.floor(Math.random() * keys.length)]
  }

  private async fetchMockData(): Promise<StockData> {
    const companyOverview = await this.fetchJson(
      'http://localhost:3000/company-overview',
    )
    const globalQuote = await this.fetchJson(
      'http://localhost:3000/global-quote',
    )

    return {
      globalQuote: globalQuoteTransformation(globalQuote),
      companyOverview: companyOverviewTransformation(companyOverview),
    } as unknown as Promise<StockData>
  }
}

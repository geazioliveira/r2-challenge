import StockAPI from './services/StockAPI.ts'
import StockWidget from './components/StockWidget.ts'
import type { GlobalQuoteModel } from './core/models/global-quote.model.ts'
import type { CompanyOverviewModel } from './core/models/company-overview.model.ts'
import { injectGlobalStyles } from './style/variables.ts'

export type StockSnapshotProp = {
  containerId: string
  symbol: string
  apiKey: string
}

export class StocksSnapshot {
  apiKey: string
  private readonly containerId: string
  private readonly symbol: string

  private constructor(config: StockSnapshotProp) {
    this.validateConfig(config)
    this.containerId = config.containerId
    this.symbol = config.symbol
    this.apiKey = config.apiKey
  }

  static init(config: StockSnapshotProp): Promise<StocksSnapshot> {
    try {
      injectGlobalStyles() // Inject fonts and variables
      const instance = new StocksSnapshot(config)
      return instance.load().then(() => instance)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  private validateConfig(config: StockSnapshotProp) {
    if (!config.containerId) throw new Error('containerId is required')
    if (!config.symbol) throw new Error('symbol is required')
    if (!config.apiKey) throw new Error('apiKey is required')
    if (config.apiKey.length !== 32) throw new Error('Invalid API key')
  }

  private async load() {
    try {
      const data = await this.fetchStockData()
      this.createAndAppendContainer(data)
    } catch (error) {
      console.error('Failed to initialize stock snapshot:', error)
      throw error
    }
  }

  /**
   * Fetches stock data for the configured symbol
   * @returns {Promise<Object>} Stock data
   */
  private async fetchStockData() {
    try {
      // TODO: Pass apiKey to StockAPI if it supports it
      console.debug(
        `Fetching stock data for ${this.symbol} with API key length ${this.apiKey.length}`,
      )
      const stockApi = new StockAPI({ apiKey: this.apiKey })
      const data = await stockApi.getQuote(this.symbol)
      console.log('Stock data fetched:', data)
      return data
    } catch (error) {
      console.error('Failed to fetch stock data:', error)
      throw error
    }
  }

  private createAndAppendContainer(data: {
    globalQuote: GlobalQuoteModel
    companyOverview: CompanyOverviewModel
  }) {
    console.log('Creating stock snapshot container...')
    if (!customElements.get('stock-widget')) {
      customElements.define('stock-widget', StockWidget)
    }

    const widgetElement = document.createElement('stock-widget') as StockWidget
    const domElement = document.getElementById(this.containerId)

    if (domElement) {
      domElement.appendChild(widgetElement)
      widgetElement.data = data
    } else {
      throw new Error(
        `Container element with ID '${this.containerId}' not found`,
      )
    }
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).StocksSnapshot = StocksSnapshot
}

StocksSnapshot.init({
  containerId: 'stocks-widget',
  symbol: 'MSFT',
  apiKey: 'YOUR_API_KEY_WITH_32_CHARS_MINIM', // API Key is validated but passed through
})
  .then(() => {
    console.log('Stocks widget ready')
  })
  .catch((err) => {
    console.error('Failed to load widget:', err)
  })

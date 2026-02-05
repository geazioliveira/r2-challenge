import StockAPI from './services/StockAPI.ts'
import StockWidget from './components/StockWidget.ts'
import type { GlobalQuoteModel } from './core/models/global-quote.model.ts'
import type { CompanyOverviewModel } from './core/models/company-overview.model.ts'
import { injectGlobalStyles } from './style/variables.ts'
import {
  type ObservabilityConfig,
  ObservabilityManager,
} from './core/observability/index.ts'

export type StockSnapshotProp = {
  containerId: string
  symbol: string
  apiKey: string
  refreshInterval?: number
  onSymbolClick?: (symbol: string) => void
  observability?: ObservabilityConfig
}

export class StocksSnapshot {
  apiKey: string
  private readonly containerId: string
  private readonly symbol: string
  private readonly refreshInterval: number
  private readonly onSymbolClick: ((symbol: string) => void) | undefined
  private refreshTimer: number | undefined
  private widgetElement: StockWidget | null = null

  private constructor(config: StockSnapshotProp) {
    this.validateConfig(config)
    this.containerId = config.containerId
    this.symbol = config.symbol
    this.apiKey = config.apiKey
    this.refreshInterval = config.refreshInterval ?? 60000
    this.onSymbolClick = config.onSymbolClick
  }

  static init(config: StockSnapshotProp): Promise<StocksSnapshot> {
    try {
      injectGlobalStyles() // Inject fonts and variables

      // Initialize observability if configured
      if (config.observability) {
        // We don't await this to avoid blocking the UI, but it might miss early events?
        // Actually, init returns a promise, so we should chain it.
        // But the manager handles lazy loading.
        ObservabilityManager.getInstance()
          .init(config.observability)
          .catch(console.error)
      }

      const instance = new StocksSnapshot(config)

      return ObservabilityManager.getInstance().withSpan(
        'stocks.init',
        async (span) => {
          span.setAttribute('component', 'StocksSnapshot')
          span.setAttribute('symbol', config.symbol)

          return instance.load().then(() => {
            span.addEvent('load_complete')
            return instance
          })
        },
      )
    } catch (error) {
      return Promise.reject(error)
    }
  }

  private validateConfig(config: StockSnapshotProp) {
    if (!config.containerId) throw new Error('containerId is required')
    if (!config.symbol) throw new Error('symbol is required')
    if (!config.apiKey) throw new Error('apiKey is required')
  }

  private async load() {
    try {
      const data = await this.fetchStockData()
      this.createAndAppendContainer(data)
      this.startAutoRefresh()
    } catch (error) {
      console.error('Failed to initialize stock snapshot:', error)
      throw error
    }
  }

  private startAutoRefresh() {
    if (this.refreshTimer) return

    this.refreshTimer = window.setInterval(async () => {
      try {
        const data = await this.fetchStockData()
        this.updateWidgetData(data)
      } catch (error) {
        console.error('Auto-refresh failed:', error)
      }
    }, this.refreshInterval)
  }

  private updateWidgetData(data: {
    globalQuote: GlobalQuoteModel
    companyOverview: CompanyOverviewModel
  }) {
    if (this.widgetElement) {
      this.widgetElement.data = data
    }
  }

  /**
   * Fetches stock data for the configured symbol
   * @returns {Promise<Object>} Stock data
   */
  private async fetchStockData() {
    try {
      // TODO: Pass apiKey to StockAPI if it supports it
      const stockApi = new StockAPI({ apiKey: this.apiKey, useMock: false })
      return await stockApi.getQuote(this.symbol)
    } catch (error) {
      console.error('Failed to fetch stock data:', error)
      throw error
    }
  }

  private createAndAppendContainer(data: {
    globalQuote: GlobalQuoteModel
    companyOverview: CompanyOverviewModel
  }) {
    if (!customElements.get('stock-widget')) {
      customElements.define('stock-widget', StockWidget)
    }

    this.widgetElement = document.createElement('stock-widget') as StockWidget
    const domElement = document.getElementById(this.containerId)

    if (domElement) {
      domElement.innerHTML = '' // Clear container before appending
      domElement.appendChild(this.widgetElement)
      this.widgetElement.data = data

      if (this.onSymbolClick) {
        this.widgetElement.addEventListener('symbol-click', ((
          e: CustomEvent,
        ) => {
          const { symbol } = e.detail
          this.onSymbolClick?.(symbol)
        }) as EventListener)
      }
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
  apiKey: '257VAR5ZNM7XEFQ9', // API Key is validated but passed through
  observability: {
    enabled: true,
    exporter: 'console',
    serviceName: 'r2-stocks-demo',
  },
})
  .then(() => {
    console.log('Stocks widget ready')
  })
  .catch((err) => {
    console.error('Failed to load widget:', err)
  })

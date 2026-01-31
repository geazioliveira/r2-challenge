import type { CompanyOverviewModel } from '../core/models/company-overview.model.ts'
import type { GlobalQuoteModel } from '../core/models/global-quote.model.ts'
import StockQuote from './StockQuote.ts'
import PriceChange from './PriceChange.ts'
import StockStats from './StockStats.ts'
import Sparkline from './Sparkline.ts'
import TimeStamp from './TimeStamp.ts'

export default class StockWidget extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  private _data: {
    companyOverview: CompanyOverviewModel | null
    globalQuote: GlobalQuoteModel | null
  } = {
    companyOverview: null,
    globalQuote: null,
  }

  public get data(): {
    companyOverview: CompanyOverviewModel | null
    globalQuote: GlobalQuoteModel | null
  } {
    return this._data
  }

  public set data(value: {
    companyOverview: CompanyOverviewModel | null
    globalQuote: GlobalQuoteModel | null
  }) {
    this._data = value
    this.render()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    if (this.shadowRoot === null) return
    this.shadowRoot.innerHTML = ''

    // Register components
    this.defineComponents()

    const style = `
      <style>
        :host {
          display: block;
          font-family: var(--stocks-font-family);
          color: var(--stocks-color-a95);
          background-color: var(--stocks-color-a5);
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 24px;
          max-width: 400px;
          border: 1px solid var(--stocks-color-a10);
        }
        
        .header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }
        
        .price-group {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
        }

        .current-price {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--stocks-color-a90);
        }

        .chart-row {
            margin: 16px 0;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stats-row {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--stocks-color-a10);
        }

        .footer-row {
            margin-top: 16px;
            text-align: right;
        }
      </style>
    `

    // Show loading state
    if (this.data.companyOverview === null || this.data.globalQuote === null) {
      this.shadowRoot.innerHTML = `
        ${style}
        <loading-spinner></loading-spinner>
      `
      return
    }

    const { companyOverview, globalQuote } = this.data

    // Create container
    const container = document.createElement('div')
    container.className = 'widget-content'

    // 1. Header Row (Stock Quote + Price + Change)
    const headerRow = document.createElement('div')
    headerRow.className = 'header-row'

    // Left: Quote Info (Symbol/Name)
    const stockQuote = document.createElement('stock-quote') as StockQuote
    stockQuote.companyOverview = companyOverview
    stockQuote.globalQuote = globalQuote
    headerRow.appendChild(stockQuote)

    // Right: Price Change
    const priceGroup = document.createElement('div')
    priceGroup.className = 'price-group'

    const priceEl = document.createElement('div')
    priceEl.className = 'current-price'
    priceEl.textContent = `$${globalQuote.price.toFixed(2)}`
    priceGroup.appendChild(priceEl)

    // If StockQuote handles raw price, maybe we hide it there or just let it be.
    // Assuming StockQuote shows Symbol + Price.
    // Let's create PriceChange separately.
    const priceChange = document.createElement('price-change') as PriceChange
    priceChange.change = globalQuote.change
    priceChange.percent = globalQuote.changePercent
    priceGroup.appendChild(priceChange)

    headerRow.appendChild(priceGroup)
    container.appendChild(headerRow)

    // 2. Chart Row
    const chartRow = document.createElement('div')
    chartRow.className = 'chart-row'
    const sparkline = document.createElement('spark-line') as Sparkline
    sparkline.isPositive = globalQuote.change >= 0
    chartRow.appendChild(sparkline)
    container.appendChild(chartRow)

    // 3. Stats Row
    const statsRow = document.createElement('div')
    statsRow.className = 'stats-row'
    const stockStats = document.createElement('stock-stats') as StockStats
    stockStats.data = companyOverview
    statsRow.appendChild(stockStats)
    container.appendChild(statsRow)

    // 4. Footer
    const footerRow = document.createElement('div')
    footerRow.className = 'footer-row'
    const timeStamp = document.createElement('time-stamp') as TimeStamp
    timeStamp.date = globalQuote.latestTradingDay
    footerRow.appendChild(timeStamp)
    container.appendChild(footerRow)

    this.shadowRoot.innerHTML = style
    this.shadowRoot.appendChild(container)
  }

  private defineComponents() {
    if (!customElements.get('stock-quote'))
      customElements.define('stock-quote', StockQuote)
    if (!customElements.get('price-change'))
      customElements.define('price-change', PriceChange)
    if (!customElements.get('stock-stats'))
      customElements.define('stock-stats', StockStats)
    if (!customElements.get('spark-line'))
      customElements.define('spark-line', Sparkline)
    if (!customElements.get('time-stamp'))
      customElements.define('time-stamp', TimeStamp)
  }
}

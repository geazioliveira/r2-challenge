import type { CompanyOverviewModel } from '../core/models/company-overview.model.ts'
import type { GlobalQuoteModel } from '../core/models/global-quote.model.ts'

export default class StockQuote extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  private _companyOverview: CompanyOverviewModel | null = null

  get companyOverview() {
    return this._companyOverview
  }

  set companyOverview(data: CompanyOverviewModel | null) {
    this._companyOverview = data
    this.render()
  }

  private _globalQuote: GlobalQuoteModel | null = null

  public get globalQuote(): GlobalQuoteModel | null {
    return this._globalQuote
  }

  public set globalQuote(value: GlobalQuoteModel | null) {
    this._globalQuote = value
    this.render()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    if (!this.companyOverview || !this.globalQuote) return
    if (this.shadowRoot === null) return

    const { symbol, name } = this.companyOverview
    const { price } = this.globalQuote

    this.shadowRoot.innerHTML = `
      <div class="stock-header">
        <div class="stock-info">
          <h2>${symbol}</h2>
          <p>${name}</p>
        </div>
        <div class="price">$${price?.toFixed(2)}</div>
      </div>
    `
  }
}

if (!customElements.get('stock-quote')) {
  customElements.define('stock-quote', StockQuote)
}

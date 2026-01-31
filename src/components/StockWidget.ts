import type { CompanyOverviewModel } from '../core/models/company-overview.model.ts'
import type { GlobalQuoteModel } from '../core/models/global-quote.model.ts'

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
    // Clear existing content
    this.shadowRoot.innerHTML = ''

    // Show loading state
    if (this.data.companyOverview === null || this.data.globalQuote === null) {
      this.shadowRoot.innerHTML = `
        <loading-spinner></loading-spinner>
      `
      return
    }
  }
}

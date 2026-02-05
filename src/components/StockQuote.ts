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

    this.shadowRoot.innerHTML = `
      <style>
        :host {
           display: block;
           font-family: var(--stocks-font-family);
        }
        .stock-header {
           display: flex;
           flex-direction: column;
           justify-content: center;
           align-items: flex-start;
        }
        .stock-info h2 {
           margin: 0;
           font-size: 1.5rem;
           color: var(--stocks-primary-color);
           cursor: pointer;
           transition: opacity 0.2s ease;
        }
        .stock-info h2:hover {
           opacity: 0.7;
        }
        .stock-info h2:focus-visible {
           outline: 2px solid var(--stocks-primary-color);
           outline-offset: 2px;
           border-radius: 4px;
        }
        .stock-info p {
           margin: 0;
           font-size: 0.875rem;
           color: var(--stocks-color-a60);
        }
      </style>
      <div class="stock-header">
        <div class="stock-info">
          <h2 tabindex="0" role="button" aria-label="View ${symbol} full quote">${symbol}</h2>
          <p>${name}</p>
        </div>
      </div>
    `

    // Attach click handler
    const symbolElement = this.shadowRoot.querySelector('h2')
    if (symbolElement) {
      symbolElement.addEventListener('click', () => this.handleSymbolClick())
      symbolElement.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          this.handleSymbolClick()
        }
      })
    }
  }

  private handleSymbolClick() {
    if (!this.companyOverview) return

    // Dispatch custom event that bubbles through Shadow DOM
    const event = new CustomEvent('symbol-click', {
      detail: { symbol: this.companyOverview.symbol },
      bubbles: true,
      composed: true, // Required to cross Shadow DOM boundary
    })

    this.dispatchEvent(event)
  }
}

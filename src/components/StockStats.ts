import type { CompanyOverviewModel } from '../core/models/company-overview.model.ts'

export default class StockStats extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  private _data: CompanyOverviewModel | null = null

  set data(value: CompanyOverviewModel | null) {
    this._data = value
    this.render()
  }

  render() {
    if (!this.shadowRoot || !this._data) return

    const stats = [
      {
        label: 'Market Cap',
        value: this.formatNumber(this._data.marketCapitalization),
      },
      { label: 'P/E Ratio', value: this._data.peRatio },
      { label: 'Div Yield', value: this._data.dividendYield + '%' },
      { label: '52W High', value: this._data.fiftyTwoWeekHigh },
      { label: '52W Low', value: this._data.fiftyTwoWeekLow },
      { label: 'EPS', value: this._data.eps },
    ]

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--stocks-font-family);
          color: var(--stocks-color-a95);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
        }
        .label {
          font-size: 0.75rem;
          color: var(--stocks-color-a60);
        }
        .value {
          font-size: 0.9rem;
          font-weight: 600;
        }
      </style>
      <div class="stats-grid">
        ${stats
          .map(
            (stat) => `
          <div class="stat-item">
            <span class="label">${stat.label}</span>
            <span class="value">${stat.value}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    `
  }

  private formatNumber(num: number): string {
    if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + 'T'
    if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + 'B'
    if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + 'M'
    return num.toString()
  }
}

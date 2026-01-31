export default class PriceChange extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  private _change: number = 0

  set change(value: number) {
    this._change = value
    this.render()
  }

  private _percent: string = '0%'

  set percent(value: string) {
    this._percent = value
    this.render()
  }

  render() {
    if (!this.shadowRoot) return

    const isPositive = this._change >= 0
    const colorVar = isPositive
      ? 'var(--stocks-positive)'
      : 'var(--stocks-negative)'
    const arrow = isPositive ? '↑' : '↓'

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          font-family: var(--stocks-font-family);
          font-weight: 500;
          color: ${colorVar};
          gap: 4px;
        }
        .change-pill {
           display: flex;
           align-items: center;
           gap: 2px;
        }
      </style>
      <span class="change-pill">
        ${arrow} ${Math.abs(this._change).toFixed(2)} (${this._percent})
      </span>
    `
  }
}

export default class TimeStamp extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  private _date: Date | null = null

  set date(value: Date | string | null) {
    if (typeof value === 'string') {
      this._date = new Date(value)
    } else {
      this._date = value
    }
    this.render()
  }

  render() {
    if (!this.shadowRoot || !this._date) return

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--stocks-font-family);
          color: var(--stocks-color-a50);
          font-size: 0.75rem;
        }
      </style>
      <span>Last update: ${this._date.toLocaleDateString()} ${this._date.toLocaleTimeString()}</span>
    `
  }
}

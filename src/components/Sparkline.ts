export default class Sparkline extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  private _isPositive: boolean = true

  set isPositive(value: boolean) {
    this._isPositive = value
    this.render()
  }

  render() {
    if (!this.shadowRoot) return

    const width = 120
    const height = 40
    const color = this._isPositive
      ? 'var(--stocks-positive)'
      : 'var(--stocks-negative)'
    const pathD = this.generateMockPath(width, height)

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        svg {
            overflow: visible;
        }
        path {
            fill: none;
            stroke-width: 2;
            stroke-linejoin: round;
            stroke-linecap: round;
        }
      </style>
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <path d="${pathD}" stroke="${color}" />
      </svg>
    `
  }

  // Generate a mock path since we don't have historical data
  private generateMockPath(width: number, height: number): string {
    let path = `M 0,${height / 2} `
    const steps = 10
    const stepX = width / steps
    let currentY = height / 2

    for (let i = 1; i <= steps; i++) {
      // Random fluctuation
      const delta = (Math.random() - 0.5) * (height * 0.8)

      // Force trend at the end
      if (i > steps - 3) {
        if (this._isPositive && delta > 0) currentY -= Math.abs(delta)
        else if (!this._isPositive && delta < 0) currentY += Math.abs(delta)
        else currentY += delta
      } else {
        currentY += delta
      }

      // Clamp
      currentY = Math.max(2, Math.min(height - 2, currentY))

      path += `L ${i * stepX},${currentY} `
    }
    return path
  }
}

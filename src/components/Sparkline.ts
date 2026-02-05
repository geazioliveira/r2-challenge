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

  /**
   * Generates a mock path string representing a fluctuating line
   * within the given dimensions.
   *
   * @param {number} width - The total width of the path to generate.
   * @param {number} height - The total height of the path to generate.
   * @return {string} A string representing the generated mock path.
   */
  private generateMockPath(width: number, height: number): string {
    let path = `M 0,${height / 2} `
    const steps = 30
    const stepX = width / steps
    let currentY = height / 2

    for (let i = 1; i <= steps; i++) {
      const delta = (Math.random() - 0.5) * (height * 0.8)

      if (i > steps - 3) {
        if (this._isPositive && delta > 0) currentY -= Math.abs(delta)
        else if (!this._isPositive && delta < 0) currentY += Math.abs(delta)
        else currentY += delta
      } else {
        currentY += delta
      }

      currentY = Math.max(2, Math.min(height - 2, currentY))

      path += `L ${i * stepX},${currentY} `
    }
    return path
  }
}

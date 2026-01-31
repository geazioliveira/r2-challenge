export default class Loading extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    if (this.shadowRoot === null) return

    console.log('Rendering loading spinner...')
    this.shadowRoot.innerHTML = `
        <style>
          .loader {
            height: 4px;
            width: 130px;
            --c:no-repeat linear-gradient(--stocks-primary-color 0 0);
            background: var(--c),var(--c),--stocks-second-color;
            background-size: 60% 100%;
            animation: l16 3s infinite;
          }
          @keyframes l16 {
            0%   {background-position:-150% 0,-150% 0}
            66%  {background-position: 250% 0,-150% 0}
            100% {background-position: 250% 0, 250% 0}
          }
        </style>     
        <div class="loader"></div>
    `
  }
}

if (!customElements.get('loading-spinner')) {
  customElements.define('loading-spinner', Loading)
}

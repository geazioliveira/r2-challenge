export const fontUrl =
  'https://fonts.googleapis.com/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap'

export const variables = `
    --stocks-font-family: "SN Pro", sans-serif;
    
    --stocks-primary-color: #000000;
    --stocks-second-color: #333333;
    
    --stocks-positive: #22c55e;
    --stocks-negative: #ef4444;

    /* Light/White shades */
    --stocks-color-a5: #ffffff;
    --stocks-color-a10: #f2e5e9;
    --stocks-color-a15: #e5cbd3;
    --stocks-color-a20: #d7b1bd;
    --stocks-color-a25: #c998a8;
    
    /* Mid shades */
    --stocks-color-a30: #bb7f94;
    --stocks-color-a35: #ac6680;
    --stocks-color-a40: #9d4d6c;
    --stocks-color-a45: #8d3259;
    
    /* Dark/Primary shades */
    --stocks-color-a50: #7d1147;
    --stocks-color-a55: #6f133f;
    --stocks-color-a60: #611438;
    --stocks-color-a65: #531430;
    
    /* Darker shades */
    --stocks-color-a70: #461429;
    --stocks-color-a75: #391222;
    --stocks-color-a80: #2c111c;
    --stocks-color-a85: #210e15;
    --stocks-color-a90: #15070c;
    --stocks-color-a95: #000000;
`

export const injectGlobalStyles = () => {
  if (typeof document === 'undefined') return

  // 1. Inject Font
  if (!document.querySelector(`link[href="${fontUrl}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontUrl
    document.head.appendChild(link)
  }

  // 2. Inject Variables
  const styleId = 'stocks-widget-variables'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
            :root {
                ${variables}
            }
            body {
                font-family: var(--stocks-font-family);
            }
        `
    document.head.appendChild(style)
  }
}

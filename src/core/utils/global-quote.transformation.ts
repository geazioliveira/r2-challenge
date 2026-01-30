import {
  type GlobalQuoteModel,
  GlobalQuoteSchema,
} from '../models/global-quote.model.ts'

/**
 * Transforms raw quote data into a structured `GlobalQuoteModel` object.
 *
 * The function takes raw financial data in the form of a key-value record, parses it,
 * and maps it to predefined fields of the `GlobalQuoteModel`. It calculates additional
 * derived values such as absolute change and determines the price movement indicator.
 *
 * @param {Record<string, any>} quoteData - Raw quote data with key-value pairs
 * representing financial metrics.
 *
 * @returns {GlobalQuoteModel} A structured object containing the transformed and parsed
 * financial data, including price, change, percentage change, trading indicators, and
 * other metrics.
 */
export const globalQuoteTransformation = (
  quoteData: Record<string, any>,
): GlobalQuoteModel => {
  const change = parseFloat(quoteData['09. change'])
  const changePercent = quoteData['10. change percent'].replace('%', '')

  // Determine up/down indicator
  let indicator = 'neutral'
  if (change > 0) {
    indicator = 'up'
  } else if (change < 0) {
    indicator = 'down'
  }

  return GlobalQuoteSchema.parse({
    symbol: quoteData['01. symbol'],
    price: parseFloat(quoteData['05. price']),
    change: change,
    changePercent: changePercent,
    changeAbsolute: Math.abs(change), // Absolute value of change
    indicator: indicator, // 'up', 'down', or 'neutral'
    latestTradingDay: quoteData['07. latest trading day'],
    open: parseFloat(quoteData['02. open']),
    high: parseFloat(quoteData['03. high']),
    low: parseFloat(quoteData['04. low']),
    volume: parseInt(quoteData['06. volume']),
    previousClose: parseFloat(quoteData['08. previous close']),
  })
}

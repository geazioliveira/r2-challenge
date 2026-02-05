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
 * representing financial metrics.
 *
 * @returns {GlobalQuoteModel} A structured object containing the transformed and parsed
 * financial data, including price, change, percentage change, trading indicators, and
 * other metrics.
 * @param globalQuote
 */
export const globalQuoteTransformation = (
  globalQuote: Record<string, any>,
): GlobalQuoteModel => {
  const quoteData = globalQuote['Global Quote']
  const change = parseFloat(quoteData['09. change'])

  // Determine up/down indicator
  let indicator = 'neutral'
  if (change > 0) {
    indicator = 'up'
  } else if (change < 0) {
    indicator = 'down'
  }
  const lastTradingDay = new Date(
    quoteData['07. latest trading day'] + 'T12:00:00Z',
  )

  return GlobalQuoteSchema.parse({
    symbol: quoteData['01. symbol'],
    price: parseFloat(quoteData['05. price']),
    change: change,
    changePercent: quoteData['10. change percent'],
    changeAbsolute: Math.abs(change), // Absolute value of change
    indicator: indicator, // 'up', 'down', or 'neutral'
    latestTradingDay: lastTradingDay,
    open: parseFloat(quoteData['02. open']),
    high: parseFloat(quoteData['03. high']),
    low: parseFloat(quoteData['04. low']),
    volume: parseInt(quoteData['06. volume']),
    previousClose: parseFloat(quoteData['08. previous close']),
  })
}

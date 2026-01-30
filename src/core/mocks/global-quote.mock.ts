import { faker } from '@faker-js/faker'
import type { GlobalQuoteModel } from '../models/global-quote.model'

export const createGlobalQuoteMock = (
  overrides?: Partial<GlobalQuoteModel>,
): GlobalQuoteModel => {
  const previousClose = faker.number.float({
    min: 100,
    max: 600,
    fractionDigits: 2,
  })
  const change = faker.number.float({ min: -50, max: 50, fractionDigits: 2 })
  const price = previousClose + change
  const changePercent = ((change / previousClose) * 100).toFixed(4)

  const low = faker.number.float({
    min: price * 0.95,
    max: price,
    fractionDigits: 2,
  })
  const high = faker.number.float({
    min: price,
    max: price * 1.05,
    fractionDigits: 2,
  })
  const open = faker.number.float({ min: low, max: high, fractionDigits: 2 })

  return {
    symbol: faker.helpers.arrayElement([
      'AAPL',
      'MSFT',
      'GOOGL',
      'AMZN',
      'META',
      'TSLA',
      'NVDA',
    ]),
    open,
    high,
    low,
    price,
    volume: faker.number.int({ min: 1_000_000, max: 500_000_000 }),
    latestTradingDay: faker.date.recent({ days: 5 }),
    previousClose,
    change,
    changePercent: `${change >= 0 ? '' : ''}${changePercent}%`,
    ...overrides,
  }
}

export const globalQuoteMock = createGlobalQuoteMock()

import { faker } from '@faker-js/faker'
import type { CompanyOverviewModel } from '../models/company-overview.model'

export const createCompanyOverviewMock = (
  overrides?: Partial<CompanyOverviewModel>,
): CompanyOverviewModel => {
  const price = faker.number.float({ min: 50, max: 600, fractionDigits: 2 })
  const sharesOutstanding = faker.number.int({
    min: 1_000_000_000,
    max: 10_000_000_000,
  })
  const marketCap = Math.round(price * sharesOutstanding)
  const revenue = faker.number.int({
    min: 50_000_000_000,
    max: 400_000_000_000,
  })
  const grossProfit = Math.round(
    revenue * faker.number.float({ min: 0.4, max: 0.7, fractionDigits: 2 }),
  )
  const ebitda = Math.round(
    revenue * faker.number.float({ min: 0.2, max: 0.5, fractionDigits: 2 }),
  )
  const eps = faker.number.float({ min: 5, max: 25, fractionDigits: 2 })

  const fiftyTwoWeekLow = faker.number.float({
    min: price * 0.6,
    max: price * 0.9,
    fractionDigits: 2,
  })
  const fiftyTwoWeekHigh = faker.number.float({
    min: price * 1.1,
    max: price * 1.5,
    fractionDigits: 2,
  })

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
    assetType: 'Common Stock',
    name: faker.company.name(),
    description: faker.lorem.paragraphs(2),
    cik: faker.string.numeric({ length: 6 }),
    exchange: faker.helpers.arrayElement(['NASDAQ', 'NYSE', 'AMEX']),
    currency: faker.finance.currencyCode(),
    country: faker.helpers.arrayElement(['USA', 'US']),
    sector: faker.helpers.arrayElement([
      'TECHNOLOGY',
      'HEALTHCARE',
      'FINANCE',
      'ENERGY',
      'CONSUMER',
    ]),
    industry: faker.helpers.arrayElement([
      'SOFTWARE - INFRASTRUCTURE',
      'SEMICONDUCTORS',
      'INTERNET RETAIL',
      'CONSUMER ELECTRONICS',
      'BIOTECHNOLOGY',
    ]),
    address: faker.location.streetAddress({ useFullAddress: true }),
    officialSite: faker.internet.url(),
    fiscalYearEnd: faker.date.month(),
    latestQuarter: faker.date.recent({ days: 90 }),
    marketCapitalization: marketCap,
    ebitda,
    peRatio: faker.number.float({ min: 10, max: 50, fractionDigits: 2 }),
    pegRatio: faker.number.float({ min: 0.5, max: 3, fractionDigits: 3 }),
    bookValue: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
    dividendPerShare: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
    dividendYield: faker.number.float({ min: 0, max: 0.05, fractionDigits: 4 }),
    eps,
    revenuePerShareTTM: faker.number.float({
      min: 20,
      max: 80,
      fractionDigits: 2,
    }),
    profitMargin: faker.number.float({ min: 0.1, max: 0.5, fractionDigits: 3 }),
    operatingMarginTTM: faker.number.float({
      min: 0.15,
      max: 0.6,
      fractionDigits: 3,
    }),
    returnOnAssetsTTM: faker.number.float({
      min: 0.05,
      max: 0.25,
      fractionDigits: 3,
    }),
    returnOnEquityTTM: faker.number.float({
      min: 0.1,
      max: 0.5,
      fractionDigits: 3,
    }),
    revenueTTM: revenue,
    grossProfitTTM: grossProfit,
    dilutedEPSTTM: eps,
    quarterlyEarningsGrowthYOY: faker.number.float({
      min: -0.2,
      max: 0.5,
      fractionDigits: 3,
    }),
    quarterlyRevenueGrowthYOY: faker.number.float({
      min: -0.1,
      max: 0.4,
      fractionDigits: 3,
    }),
    analystTargetPrice: faker.number.float({
      min: price * 1.1,
      max: price * 1.5,
      fractionDigits: 2,
    }),
    analystRatingStrongBuy: faker.number.int({ min: 5, max: 20 }),
    analystRatingBuy: faker.number.int({ min: 20, max: 50 }),
    analystRatingHold: faker.number.int({ min: 0, max: 10 }),
    analystRatingSell: faker.number.int({ min: 0, max: 5 }),
    analystRatingStrongSell: faker.number.int({ min: 0, max: 2 }),
    trailingPE: faker.number.float({ min: 15, max: 40, fractionDigits: 2 }),
    forwardPE: faker.number.float({ min: 15, max: 40, fractionDigits: 2 }),
    priceToSalesRatioTTM: faker.number.float({
      min: 2,
      max: 20,
      fractionDigits: 2,
    }),
    priceToBookRatio: faker.number.float({
      min: 2,
      max: 15,
      fractionDigits: 2,
    }),
    evToRevenue: faker.number.float({ min: 3, max: 20, fractionDigits: 2 }),
    evToEBITDA: faker.number.float({ min: 10, max: 30, fractionDigits: 2 }),
    beta: faker.number.float({ min: 0.5, max: 2, fractionDigits: 3 }),
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    fiftyDayMovingAverage: faker.number.float({
      min: price * 0.9,
      max: price * 1.1,
      fractionDigits: 2,
    }),
    twoHundredDayMovingAverage: faker.number.float({
      min: price * 0.85,
      max: price * 1.15,
      fractionDigits: 2,
    }),
    sharesOutstanding,
    sharesFloat: Math.round(
      sharesOutstanding *
        faker.number.float({ min: 0.95, max: 0.99, fractionDigits: 2 }),
    ),
    percentInsiders: faker.number.float({
      min: 0.01,
      max: 0.15,
      fractionDigits: 3,
    }),
    percentInstitutions: faker.number.float({
      min: 50,
      max: 85,
      fractionDigits: 3,
    }),
    dividendDate: faker.date.future({ years: 1 }),
    exDividendDate: faker.date.future({ years: 1 }),
    ...overrides,
  }
}

export const companyOverviewMock: CompanyOverviewModel =
  createCompanyOverviewMock()

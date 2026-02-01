import {
  type CompanyOverviewModel,
  CompanyOverviewSchema,
} from '../models/company-overview.model.ts'

/**
 * Transforms a raw company overview object into a structured `CompanyOverviewModel` by mapping and parsing
 * the data using the defined schema.
 *
 * @param {Record<string, any>} companyOverview - The raw company overview data, typically sourced from an external API or data source.
 * @returns {CompanyOverviewModel} - A validated and structured representation of the company overview data.
 *
 * This function extracts and maps the following keys from the raw data:
 * - `symbol`: The stock ticker symbol of the company.
 * - `assetType`: The type of asset, e.g., stock, ETF, etc.
 * - `name`: The name of the company.
 * - `description`: A textual description of the company.
 * - `cik`: The Central Index Key (CIK) of the company.
 * - `exchange`: The stock exchange where the company is listed.
 * - `currency`: The currency in which the company operates.
 * - `country`: The country where the company is based.
 * - `sector`: The sector in which the company operates.
 * - `industry`: The industry to which the company belongs.
 * - `address`: The physical address of the company’s headquarters.
 * - `officialSite`: The URL of the company's official website.
 * - `fiscalYearEnd`: The fiscal year-end date of the company.
 * - `latestQuarter`: The date of the latest reported quarter.
 * - `marketCapitalization`: The market capitalization of the company.
 * - `ebitda`: The earnings before interest, taxes, depreciation, and amortization.
 * - `peRatio`: The price-to-earnings ratio.
 * - `pegRatio`: The price/earnings-to-growth ratio.
 * - `bookValue`: The book value per share.
 * - `dividendPerShare`: The dividend value per share.
 * - `dividendYield`: The dividend yield as a percentage.
 * - `eps`: The earnings per share of the company.
 * - `revenuePerShareTTM`: The revenue per share over the trailing twelve months.
 * - `profitMargin`: The profit margin as a percentage.
 * - `operatingMarginTTM`: The operating margin over the trailing twelve months.
 * - `returnOnAssetsTTM`: The return on assets over the trailing twelve months.
 * - `returnOnEquityTTM`: The return on equity over the trailing twelve months.
 * - `revenueTTM`: Total revenue over the trailing twelve months.
 * - `grossProfitTTM`: Gross profit over the trailing twelve months.
 * - `dilutedEPSTTM`: Diluted earnings per share over the trailing twelve months.
 * - `quarterlyEarningsGrowthYOY`: Quarterly earnings growth year-over-year as a percentage.
 * - `quarterlyRevenueGrowthYOY`: Quarterly revenue growth year-over-year as a percentage.
 * - `analystTargetPrice`: The consensus target price by analysts.
 * - `analystRatingStrongBuy`: Number of "strong buy" ratings by analysts.
 * - `analystRatingBuy`: Number of "buy" ratings by analysts.
 * - `analystRatingHold`: Number of "hold" ratings by analysts.
 * - `analystRatingSell`: Number of "sell" ratings by analysts.
 * - `analystRatingStrongSell`: Number of "strong sell" ratings by analysts.
 * - `trailingPE`: The trailing price-to-earnings ratio.
 * - `forwardPE`: The forward price-to-earnings ratio.
 * - `priceToSalesRatioTTM`: The price-to-sales ratio over the trailing twelve months.
 * - `priceToBookRatio`: The price-to-book ratio.
 * - `evToRevenue`: The enterprise value-to-revenue ratio.
 * - `evToEBITDA`: The enterprise value-to-EBITDA ratio.
 * - `beta`: The beta value representing stock volatility.
 * - `fiftyTwoWeekHigh`: The highest stock price over the last 52 weeks.
 * - `fiftyTwoWeekLow`: The lowest stock price over the last 52 weeks.
 * - `fiftyDayMovingAverage`: The 50-day moving average of the stock price.
 * - `twoHundredDayMovingAverage`: The 200-day moving average of the stock price.
 * - `sharesOutstanding`: The total shares outstanding.
 * - `sharesFloat`: The total number of freely tradeable shares.
 * - `percentInsiders`: The percentage of insider ownership.
 * - `percentInstitutions`: The percentage of institutional ownership.
 * - `dividendDate`: The date on which the last dividend was paid.
 * - `exDividendDate`: The ex-dividend date for the latest dividend payment.
 *
 * This function ensures that the transformed data conforms to the expected `CompanyOverviewModel` schema, providing
 * a cleaner and more usable structure for handling company financial and descriptive data.
 */
export const companyOverviewTransformation = (
  companyOverview: Record<string, any>,
): CompanyOverviewModel => {
  return CompanyOverviewSchema.parse({
    symbol: companyOverview.Symbol,
    assetType: companyOverview.AssetType,
    name: companyOverview.Name,
    description: companyOverview.Description,
    cik: companyOverview.CIK,
    exchange: companyOverview.Exchange,
    currency: companyOverview.Currency,
    country: companyOverview.Country,
    sector: companyOverview.Sector,
    industry: companyOverview.Industry,
    address: companyOverview.Address,
    officialSite: companyOverview.OfficialSite,
    fiscalYearEnd: companyOverview.FiscalYearEnd,
    latestQuarter: companyOverview.LatestQuarter,
    marketCapitalization: companyOverview.MarketCapitalization,
    ebitda: companyOverview.EBITDA,
    peRatio: companyOverview.PERatio,
    pegRatio: companyOverview.PEGRatio,
    bookValue: companyOverview.BookValue,
    dividendPerShare: companyOverview.DividendPerShare,
    dividendYield: companyOverview.DividendYield,
    eps: companyOverview.EPS,
    revenuePerShareTTM: companyOverview.RevenuePerShareTTM,
    profitMargin: companyOverview.ProfitMargin,
    operatingMarginTTM: companyOverview.OperatingMarginTTM,
    returnOnAssetsTTM: companyOverview.ReturnOnAssetsTTM,
    returnOnEquityTTM: companyOverview.ReturnOnEquityTTM,
    revenueTTM: companyOverview.RevenueTTM,
    grossProfitTTM: companyOverview.GrossProfitTTM,
    dilutedEPSTTM: companyOverview.DilutedEPSTTM,
    quarterlyEarningsGrowthYOY: companyOverview.QuarterlyEarningsGrowthYOY,
    quarterlyRevenueGrowthYOY: companyOverview.QuarterlyRevenueGrowthYOY,
    analystTargetPrice: companyOverview.AnalystTargetPrice,
    analystRatingStrongBuy: companyOverview.AnalystRatingStrongBuy,
    analystRatingBuy: companyOverview.AnalystRatingBuy,
    analystRatingHold: companyOverview.AnalystRatingHold,
    analystRatingSell: companyOverview.AnalystRatingSell,
    analystRatingStrongSell: companyOverview.AnalystRatingStrongSell,
    trailingPE: companyOverview.TrailingPE,
    forwardPE: companyOverview.ForwardPE,
    priceToSalesRatioTTM: companyOverview.PriceToSalesRatioTTM,
    priceToBookRatio: companyOverview.PriceToBookRatio,
    evToRevenue: companyOverview.EVToRevenue,
    evToEBITDA: companyOverview.EVToEBITDA,
    beta: companyOverview.Beta,
    fiftyTwoWeekHigh: companyOverview['52WeekHigh'],
    fiftyTwoWeekLow: companyOverview['52WeekLow'],
    fiftyDayMovingAverage: companyOverview['50DayMovingAverage'],
    twoHundredDayMovingAverage: companyOverview['200DayMovingAverage'],
    sharesOutstanding: companyOverview.SharesOutstanding,
    sharesFloat: companyOverview.SharesFloat,
    percentInsiders: companyOverview.PercentInsiders,
    percentInstitutions: companyOverview.PercentInstitutions,
    dividendDate: companyOverview.DividendDate,
    exDividendDate: companyOverview.ExDividendDate,
  })
}

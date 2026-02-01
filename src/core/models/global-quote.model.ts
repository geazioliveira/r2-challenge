import { z } from 'zod'

export const GlobalQuoteSchema = z.object({
  symbol: z.string().min(1).max(10),
  open: z.number().nonnegative(),
  high: z.number().nonnegative(),
  low: z.number().nonnegative(),
  price: z.number().nonnegative(),
  volume: z.number().int().nonnegative(),
  latestTradingDay: z.date(),
  previousClose: z.number().nonnegative(),
  change: z.number(),
  changePercent: z.string(),
  indicator: z.enum(['up', 'down', 'neutral']),
  changeAbsolute: z.number().nonnegative(),
})

export type GlobalQuoteModel = z.infer<typeof GlobalQuoteSchema>

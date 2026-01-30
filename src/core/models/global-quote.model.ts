import { z } from 'zod'

export const GlobalQuoteSchema = z.object({
  symbol: z.string().min(1).max(10),
  open: z.coerce.number().nonnegative(),
  high: z.coerce.number().nonnegative(),
  low: z.coerce.number().nonnegative(),
  price: z.coerce.number().nonnegative(),
  volume: z.coerce.number().int().nonnegative(),
  latestTradingDay: z.coerce.date(),
  previousClose: z.coerce.number().nonnegative(),
  change: z.coerce.number(),
  changePercent: z
    .string()
    .regex(/^-?\d+(\.\d+)?%$/, 'Invalid percentage format'),
  indicator: z.enum(['up', 'down', 'neutral']),
  changeAbsolute: z.coerce.number().nonnegative(),
})

export type GlobalQuoteModel = z.infer<typeof GlobalQuoteSchema>

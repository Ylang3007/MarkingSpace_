import { z } from 'zod';
import { FINANCE_TAGS } from '../config/financeTags';
import type { FinanceTag } from '../config/financeTags';

const financeTagSchema = z.enum(
  FINANCE_TAGS.map((tag) => tag.label) as [FinanceTag, ...FinanceTag[]],
);

export const labelItemSchema = z.object({
  label: financeTagSchema,
  ratio: z.number().min(0).max(1),
});

export const fundRecordSchema = z.object({
  fundCode: z.string().min(1),
  fundName: z.string().min(1),
  manager: z.string(),
  primaryCategory: z.string(),
  secondaryCategory: z.string(),
  technologyFinanceRatio: z.number().min(0).max(1),
  greenFinanceRatio: z.number().min(0).max(1),
  inclusiveFinanceRatio: z.number().min(0).max(1),
  pensionFinanceRatio: z.number().min(0).max(1),
  digitalFinanceRatio: z.number().min(0).max(1),
  fundScale: z.number().nonnegative().nullable(),
  stockHoldingRatio: z.number().min(0).max(1).nullable().optional(),
  coreLabels: z.array(labelItemSchema),
  relatedLabels: z.array(labelItemSchema),
});

export const fundDataPayloadSchema = z.object({
  meta: z.object({
    asOfDate: z.string().min(1),
    generatedAt: z.string().min(1),
    recordCount: z.number().int().nonnegative(),
    ruleVersion: z.string().min(1),
  }),
  funds: z.array(fundRecordSchema),
});

export type FundDataPayload = z.infer<typeof fundDataPayloadSchema>;
export type FundRecord = z.infer<typeof fundRecordSchema>;

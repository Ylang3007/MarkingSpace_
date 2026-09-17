import type { FinanceTag, FinanceTagField } from '../config/financeTags';

export type FundRatios = Record<FinanceTagField, number>;

export type TagRatioItem = {
  label: FinanceTag;
  ratio: number;
};

export type LabelItem = TagRatioItem;

export interface FundRecord extends FundRatios {
  fundCode: string;
  fundName: string;
  manager: string;
  primaryCategory: string;
  secondaryCategory: string;
  fundScale: number | null;
  stockHoldingRatio?: number | null;
  coreLabels: LabelItem[];
  relatedLabels: LabelItem[];
}

export interface FundDataMeta {
  asOfDate: string;
  generatedAt: string;
  recordCount: number;
  ruleVersion: string;
}

export interface FundDataPayload {
  meta: FundDataMeta;
  funds: FundRecord[];
}

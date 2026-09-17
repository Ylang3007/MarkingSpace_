import { FINANCE_TAGS } from '../config/financeTags';
import type { FinanceTagField, FinanceTagLabel } from '../config/financeTags';
import {
  SOURCE_CORE_LABEL_FIELDS,
  SOURCE_OPTIONAL_NUMBER_FIELDS,
  SOURCE_RELATED_LABEL_FIELDS,
  SOURCE_REQUIRED_NUMBER_FIELDS,
  SOURCE_TEXT_FIELDS,
  type SourceTextFieldKey,
} from '../config/sourceFields';
import type { FundRatios, FundRecord, LabelItem } from '../domain/fundTypes';
import { computeLabels } from '../domain/tagRules';

const RATIO_EPSILON = 1e-9;

export function trimText(input: unknown): string {
  if (input === null || input === undefined) return '';
  return String(input).trim();
}

export function parseRatio(input: unknown): number {
  if (input === null || input === undefined || input === '') return 0;
  if (typeof input === 'number') return toValidRatio(input);
  if (typeof input === 'string') {
    const text = input.trim();
    const normalized = text.toUpperCase();
    if (normalized === 'NA' || normalized === 'N/A' || text === '--') {
      return 0;
    }
    const rawNumber = text.endsWith('%')
      ? Number.parseFloat(text.slice(0, -1)) / 100
      : Number.parseFloat(text);
    return toValidRatio(rawNumber);
  }
  throw new Error(`无法解析占比：${String(input)}`);
}

export function parseFundScale(
  input: unknown,
  fundCode: string,
  sourceField: string,
): number | null {
  if (input === null || input === undefined || input === '') return null;

  if (typeof input === 'number') {
    if (!Number.isFinite(input) || input < 0) {
      throw new Error(
        `${sourceField}解析失败：基金代码 ${fundCode}，原始值 ${String(input)}`,
      );
    }
    return input;
  }

  if (typeof input === 'string') {
    const text = input.trim();
    const normalized = text.toUpperCase();
    if (text === '' || normalized === 'NA' || normalized === 'N/A' || text === '--') {
      return null;
    }

    const value = Number(text);
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(
        `${sourceField}解析失败：基金代码 ${fundCode}，原始值 ${JSON.stringify(input)}`,
      );
    }
    return value;
  }

  throw new Error(
    `${sourceField}解析失败：基金代码 ${fundCode}，原始值 ${JSON.stringify(input)}`,
  );
}

export function parseOptionalNumber(input: unknown): number | null {
  if (input === null || input === undefined || input === '') return null;
  const value = typeof input === 'number' ? input : Number.parseFloat(String(input));
  return Number.isFinite(value) ? value : null;
}

export function parseOptionalRatio(input: unknown): number | null {
  const value = parseOptionalNumber(input);
  if (value === null) return null;
  return toValidRatio(value);
}

function toValidRatio(value: number): number {
  if (!Number.isFinite(value) || value < -RATIO_EPSILON || value > 1 + RATIO_EPSILON) {
    throw new Error(`占比必须在 0 到 1 之间，收到：${value}`);
  }
  return Math.min(1, Math.max(0, value));
}

export function buildFundRecord(
  getCell: (sourceField: string) => unknown,
): FundRecord {
  const textValues = {} as Record<SourceTextFieldKey, string>;
  const missingRequired: string[] = [];

  for (const key of Object.keys(SOURCE_TEXT_FIELDS) as SourceTextFieldKey[]) {
    const config = SOURCE_TEXT_FIELDS[key];
    const value = trimText(getCell(config.sourceField));
    textValues[key] = value;

    if (config.required && !value) {
      missingRequired.push(config.sourceField);
    }
  }

  if (missingRequired.length > 0) {
    const fundCode = textValues.fundCode || '（基金代码缺失）';
    throw new Error(
      `基金代码 ${fundCode} 缺失必填字段：${missingRequired.join('、')}`,
    );
  }

  const ratios = {} as FundRatios;
  for (const tag of FINANCE_TAGS) {
    try {
      ratios[tag.field] = parseRatio(getCell(tag.sourceField));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `基金代码 ${textValues.fundCode || '（缺失）'} 字段 ${tag.sourceField} ${message}`,
      );
    }
  }

  const labels = computeLabels(ratios);

  return {
    fundCode: textValues.fundCode,
    fundName: textValues.fundName,
    manager: textValues.manager,
    primaryCategory: textValues.primaryCategory,
    secondaryCategory: textValues.secondaryCategory,
    ...ratios,
    fundScale: parseFundScale(
      getCell(SOURCE_REQUIRED_NUMBER_FIELDS.fundScale),
      textValues.fundCode,
      SOURCE_REQUIRED_NUMBER_FIELDS.fundScale,
    ),
    stockHoldingRatio: parseOptionalRatio(
      getCell(SOURCE_OPTIONAL_NUMBER_FIELDS.stockHoldingRatio),
    ),
    coreLabels: labels.coreLabels,
    relatedLabels: labels.relatedLabels,
  };
}

export function parseSourceLabels(
  getCell: (sourceField: string) => unknown,
): { coreLabels: LabelItem[]; relatedLabels: LabelItem[] } {
  const coreLabels: LabelItem[] = SOURCE_CORE_LABEL_FIELDS.flatMap(
    ({ labelField, ratioField }) => {
      const label = trimText(getCell(labelField));
      const ratio = parseRatio(getCell(ratioField));
      return label && ratio > 0
        ? [{ label: label as FinanceTagLabel, ratio }]
        : [];
    },
  );

  const relatedLabels: LabelItem[] = SOURCE_RELATED_LABEL_FIELDS.flatMap(
    ({ labelField, ratioField }) => {
      const label = trimText(getCell(labelField));
      const ratio = parseRatio(getCell(ratioField));
      return label && ratio > 0
        ? [{ label: label as FinanceTagLabel, ratio }]
        : [];
    },
  );

  return { coreLabels, relatedLabels };
}

export function compareLabels(
  computed: LabelItem[],
  source: LabelItem[],
): boolean {
  if (computed.length !== source.length) return false;
  return computed.every((item) =>
    source.some(
      (sourceItem) =>
        sourceItem.label === item.label &&
        Math.abs(sourceItem.ratio - item.ratio) < 1e-6,
    ),
  );
}

export function isFinanceTagLabel(value: string): value is FinanceTagLabel {
  return FINANCE_TAGS.some((tag) => tag.label === value);
}

export type { FinanceTagField };

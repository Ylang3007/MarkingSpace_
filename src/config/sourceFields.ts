import { FINANCE_TAGS } from './financeTags';

export const SOURCE_TEXT_FIELDS = {
  fundCode: {
    sourceField: '基金代码',
    required: true,
  },
  fundName: {
    sourceField: '基金简称',
    required: true,
  },
  manager: {
    sourceField: '管理人',
    required: true,
  },
  primaryCategory: {
    sourceField: '一级分类',
    required: true,
  },
  secondaryCategory: {
    sourceField: '二级分类',
    required: true,
  },
} as const;

export type SourceTextFieldKey = keyof typeof SOURCE_TEXT_FIELDS;

export const SOURCE_REQUIRED_NUMBER_FIELDS = {
  fundScale: '基金规模（亿元）',
} as const;

export const SOURCE_OPTIONAL_NUMBER_FIELDS = {
  stockHoldingRatio: '股票持仓',
} as const;

export const SOURCE_CORE_LABEL_FIELDS = [
  {
    labelField: '核心标签1',
    ratioField: '核心标签占比1',
  },
  {
    labelField: '核心标签2',
    ratioField: '核心标签占比2',
  },
] as const;

export const SOURCE_RELATED_LABEL_FIELDS = [
  {
    labelField: '关联标签1',
    ratioField: '关联标签占比1',
  },
  {
    labelField: '关联标签2',
    ratioField: '关联标签占比2',
  },
  {
    labelField: '关联标签3',
    ratioField: '关联标签占比3',
  },
] as const;

export function getRequiredSourceFields(): string[] {
  const textFields = (
    Object.keys(SOURCE_TEXT_FIELDS) as SourceTextFieldKey[]
  )
    .filter((key) => SOURCE_TEXT_FIELDS[key].required)
    .map((key) => SOURCE_TEXT_FIELDS[key].sourceField);
  const requiredNumberFields = Object.values(
    SOURCE_REQUIRED_NUMBER_FIELDS,
  ) as string[];

  return [
    ...textFields,
    ...requiredNumberFields,
    ...FINANCE_TAGS.map((tag) => tag.sourceField),
  ];
}

export function getMissingRequiredSourceFields(
  headers: readonly string[],
): string[] {
  return getRequiredSourceFields().filter((field) => !headers.includes(field));
}

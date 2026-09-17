export type FinanceTagField =
  | 'technologyFinanceRatio'
  | 'greenFinanceRatio'
  | 'inclusiveFinanceRatio'
  | 'pensionFinanceRatio'
  | 'digitalFinanceRatio';

export type FinanceTagLabel =
  | '科技金融'
  | '绿色金融'
  | '普惠金融'
  | '养老金融'
  | '数字金融';

export type FinanceTag = FinanceTagLabel;

export interface FinanceTagConfig {
  id: string;
  label: FinanceTag;
  color: string;
  lightColor: string;
  field: FinanceTagField;
  sourceField: string;
}

export const FINANCE_TAGS: FinanceTagConfig[] = [
  {
    id: 'technology',
    label: '科技金融',
    color: '#2563EB',
    lightColor: '#93C5FD',
    field: 'technologyFinanceRatio',
    sourceField: '科技金融占比',
  },
  {
    id: 'green',
    label: '绿色金融',
    color: '#16A34A',
    lightColor: '#86EFAC',
    field: 'greenFinanceRatio',
    sourceField: '绿色金融占比',
  },
  {
    id: 'inclusive',
    label: '普惠金融',
    color: '#D97706',
    lightColor: '#FCD34D',
    field: 'inclusiveFinanceRatio',
    sourceField: '普惠金融占比',
  },
  {
    id: 'pension',
    label: '养老金融',
    color: '#7C3AED',
    lightColor: '#C4B5FD',
    field: 'pensionFinanceRatio',
    sourceField: '养老金融占比',
  },
  {
    id: 'digital',
    label: '数字金融',
    color: '#0891B2',
    lightColor: '#67E8F9',
    field: 'digitalFinanceRatio',
    sourceField: '数字金融占比',
  },
];

export const FINANCE_TAG_FIELD_BY_LABEL = new Map<FinanceTag, FinanceTagField>(
  FINANCE_TAGS.map((tag) => [tag.label, tag.field]),
);

import { FINANCE_TAGS } from '../config/financeTags';
import type { FundRatios, LabelItem } from './fundTypes';

export const CORE_LABEL_THRESHOLD = 0.5;
export const RELATED_LABEL_THRESHOLD = 0.2;

export interface ComputedLabels {
  coreLabels: LabelItem[];
  relatedLabels: LabelItem[];
}

export function computeLabels(ratios: FundRatios): ComputedLabels {
  const coreLabels: LabelItem[] = [];
  const relatedLabels: LabelItem[] = [];

  for (const tag of FINANCE_TAGS) {
    const ratio = ratios[tag.field];
    if (ratio >= CORE_LABEL_THRESHOLD) {
      coreLabels.push({ label: tag.label, ratio });
    } else if (ratio >= RELATED_LABEL_THRESHOLD) {
      relatedLabels.push({ label: tag.label, ratio });
    }
  }

  return { coreLabels, relatedLabels };
}

export function getMaxRatio(ratios: FundRatios): number {
  return Math.max(...FINANCE_TAGS.map((tag) => ratios[tag.field]));
}

export function hasLabel(
  labels: LabelItem[],
  selectedTags: readonly string[],
): boolean {
  return labels.some((item) => selectedTags.includes(item.label));
}

import { FINANCE_TAGS } from '../config/financeTags';
import type { FundRecord } from './fundTypes';
import { getMaxRatio, hasLabel } from './tagRules';

export interface FundFilter {
  fundCodes: string[];
  fundCodeFilterApplied: boolean;
  secondaryCategories?: string[];
  coreTags: string[];
  relatedTags: string[];
}

export interface TagCoverageStat {
  label: string;
  coreCount: number;
  relatedCount: number;
  totalCount: number;
}

export interface FundPoolOverview {
  total: number;
  coreCount: number;
  relatedOnlyCount: number;
  noneCount: number;
  coverage: TagCoverageStat[];
}

export function getFundPoolOverview(funds: FundRecord[]): FundPoolOverview {
  let coreCount = 0;
  let relatedOnlyCount = 0;
  let noneCount = 0;

  const coverage = FINANCE_TAGS.map((tag) => ({
    label: tag.label,
    coreCount: 0,
    relatedCount: 0,
    totalCount: 0,
  }));

  for (const fund of funds) {
    if (fund.coreLabels.length > 0) {
      coreCount += 1;
    } else if (fund.relatedLabels.length > 0) {
      relatedOnlyCount += 1;
    } else {
      noneCount += 1;
    }

    coverage.forEach((stat, index) => {
      const label = FINANCE_TAGS[index].label;
      const hasCore = fund.coreLabels.some((item) => item.label === label);
      const hasRelated = fund.relatedLabels.some((item) => item.label === label);
      if (hasCore) stat.coreCount += 1;
      if (hasRelated) stat.relatedCount += 1;
      stat.totalCount = stat.coreCount + stat.relatedCount;
    });
  }

  return {
    total: funds.length,
    coreCount,
    relatedOnlyCount,
    noneCount,
    coverage,
  };
}

export function filterFunds(
  funds: FundRecord[],
  filter: FundFilter,
): FundRecord[] {
  const fundCodeSet = new Set(filter.fundCodes);

  return funds.filter((fund) => {
    const fundCodeMatch =
      !filter.fundCodeFilterApplied || fundCodeSet.has(fund.fundCode);
    const secondaryCategoryMatch =
      !filter.secondaryCategories ||
      filter.secondaryCategories.length === 0 ||
      filter.secondaryCategories.includes(fund.secondaryCategory);
    const coreMatch =
      filter.coreTags.length === 0 ||
      hasLabel(fund.coreLabels, filter.coreTags);
    const relatedMatch =
      filter.relatedTags.length === 0 ||
      hasLabel(fund.relatedLabels, filter.relatedTags);
    return (
      fundCodeMatch &&
      secondaryCategoryMatch &&
      coreMatch &&
      relatedMatch
    );
  });
}

export function getSecondaryCategoryOptions(
  funds: FundRecord[],
): string[] {
  const options = new Set<string>();
  for (const fund of funds) {
    const category = fund.secondaryCategory.trim();
    if (category) options.add(category);
  }

  return Array.from(options).sort(
    new Intl.Collator('zh-Hans-CN').compare,
  );
}

export function sortFundsByMaxRatio(funds: FundRecord[]): FundRecord[] {
  return [...funds].sort((a, b) => {
    const ratioDiff = getMaxRatio(b) - getMaxRatio(a);
    if (ratioDiff !== 0) return ratioDiff;
    return a.fundCode.localeCompare(b.fundCode);
  });
}

export function findFundByCode(
  funds: FundRecord[],
  fundCode: string,
): FundRecord | undefined {
  return funds.find((fund) => fund.fundCode === fundCode);
}

export function paginateFunds(
  funds: FundRecord[],
  page: number,
  pageSize: number,
): FundRecord[] {
  const start = (page - 1) * pageSize;
  return funds.slice(start, start + pageSize);
}

export function getTotalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

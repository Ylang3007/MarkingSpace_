import { describe, expect, it } from 'vitest';
import {
  filterFunds,
  findFundByCode,
  getSecondaryCategoryOptions,
  getFundPoolOverview,
  getTotalPages,
  paginateFunds,
  sortFundsByMaxRatio,
} from '../../src/domain/fundSelectors';
import type { FundRecord } from '../../src/domain/fundTypes';
import { computeLabels } from '../../src/domain/tagRules';

function fund(
  code: string,
  technologyFinanceRatio: number,
  greenFinanceRatio = 0,
): FundRecord {
  const labels = computeLabels({
    technologyFinanceRatio,
    greenFinanceRatio,
    inclusiveFinanceRatio: 0,
    pensionFinanceRatio: 0,
    digitalFinanceRatio: 0,
  });

  return {
    fundCode: code,
    fundName: `基金${code}`,
    manager: '测试基金管理有限公司',
    primaryCategory: '债券型基金',
    secondaryCategory: '中长期纯债型基金',
    fundScale: null,
    technologyFinanceRatio,
    greenFinanceRatio,
    inclusiveFinanceRatio: 0,
    pensionFinanceRatio: 0,
    digitalFinanceRatio: 0,
    coreLabels: labels.coreLabels,
    relatedLabels: labels.relatedLabels,
  };
}

describe('getFundPoolOverview', () => {
  it('三个状态互斥并覆盖全部基金', () => {
    const funds = [
      fund('000001.OF', 0.6),
      fund('000002.OF', 0.3),
      fund('000003.OF', 0.1),
    ];
    const overview = getFundPoolOverview(funds);

    expect(overview.total).toBe(3);
    expect(overview.coreCount).toBe(1);
    expect(overview.relatedOnlyCount).toBe(1);
    expect(overview.noneCount).toBe(1);
    expect(
      overview.coreCount + overview.relatedOnlyCount + overview.noneCount,
    ).toBe(overview.total);
  });

  it('统计每个标签的核心与关联覆盖数', () => {
    const funds = [fund('000001.OF', 0.6), fund('000002.OF', 0.3)];
    const overview = getFundPoolOverview(funds);
    const technology = overview.coverage.find(
      (item) => item.label === '科技金融',
    );

    expect(technology?.coreCount).toBe(1);
    expect(technology?.relatedCount).toBe(1);
    expect(technology?.totalCount).toBe(2);
  });

  it('具有多个核心标签的基金分别计入相应标签的核心覆盖数', () => {
    const funds = [fund('000004.OF', 0.6, 0.6)];
    const overview = getFundPoolOverview(funds);
    const technology = overview.coverage.find(
      (item) => item.label === '科技金融',
    );
    const green = overview.coverage.find(
      (item) => item.label === '绿色金融',
    );

    expect(overview.coreCount).toBe(1);
    expect(technology?.coreCount).toBe(1);
    expect(green?.coreCount).toBe(1);
  });
});

describe('filterFunds', () => {
  it('同组多选按 OR、跨组按 AND 执行', () => {
    const funds = [
      fund('000001.OF', 0.6),
      fund('000002.OF', 0.6, 0.3),
      fund('000003.OF', 0.1),
    ];

    const result = filterFunds(funds, {
      fundCodes: [],
      fundCodeFilterApplied: false,
      coreTags: ['科技金融'],
      relatedTags: ['绿色金融'],
    });

    expect(result.map((item) => item.fundCode)).toEqual(['000002.OF']);
  });

  it('基金代码子集与核心/关联标签按 AND 执行', () => {
    const funds = [
      fund('000001.OF', 0.6),
      fund('000002.OF', 0.6, 0.3),
      fund('000003.OF', 0.1),
    ];

    const result = filterFunds(funds, {
      fundCodes: ['000002.OF', '000003.OF'],
      fundCodeFilterApplied: true,
      coreTags: ['科技金融'],
      relatedTags: ['绿色金融'],
    });

    expect(result.map((item) => item.fundCode)).toEqual(['000002.OF']);
  });

  it('基金代码筛选已应用但全部未匹配时结果为空', () => {
    const funds = [fund('000001.OF', 0.6)];

    const result = filterFunds(funds, {
      fundCodes: [],
      fundCodeFilterApplied: true,
      coreTags: [],
      relatedTags: [],
    });

    expect(result).toEqual([]);
  });

  it('多个二级分类按 OR 筛选', () => {
    const funds = [
      { ...fund('000001.OF', 0.6), secondaryCategory: '中长期纯债型基金' },
      { ...fund('000002.OF', 0.3), secondaryCategory: '偏债混合型基金' },
      { ...fund('000003.OF', 0.1), secondaryCategory: '短期纯债型基金' },
    ];

    const result = filterFunds(funds, {
      fundCodes: [],
      fundCodeFilterApplied: false,
      secondaryCategories: ['中长期纯债型基金', '短期纯债型基金'],
      coreTags: [],
      relatedTags: [],
    });

    expect(result.map((item) => item.fundCode)).toEqual([
      '000001.OF',
      '000003.OF',
    ]);
  });

  it('二级分类与基金代码、标签按 AND 组合', () => {
    const funds = [
      {
        ...fund('000001.OF', 0.6),
        secondaryCategory: '中长期纯债型基金',
      },
      {
        ...fund('000002.OF', 0.6, 0.3),
        secondaryCategory: '偏债混合型基金',
      },
    ];

    const result = filterFunds(funds, {
      fundCodes: ['000002.OF'],
      fundCodeFilterApplied: true,
      secondaryCategories: ['偏债混合型基金'],
      coreTags: ['科技金融'],
      relatedTags: ['绿色金融'],
    });

    expect(result.map((item) => item.fundCode)).toEqual(['000002.OF']);
  });
});

describe('getSecondaryCategoryOptions', () => {
  it('从全量数据动态去重并按中文名称升序生成', () => {
    const funds = [
      { ...fund('000001.OF', 0.1), secondaryCategory: ' 偏债混合型基金 ' },
      { ...fund('000002.OF', 0.2), secondaryCategory: '中长期纯债型基金' },
      { ...fund('000003.OF', 0.3), secondaryCategory: '偏债混合型基金' },
    ];

    expect(getSecondaryCategoryOptions(funds)).toEqual([
      '偏债混合型基金',
      '中长期纯债型基金',
    ]);
  });
});

describe('sortFundsByMaxRatio', () => {
  it('按最大占比降序，相同时按基金代码升序', () => {
    const funds = [
      fund('000002.OF', 0.4),
      fund('000001.OF', 0.4),
      fund('000003.OF', 0.7),
    ];
    const sorted = sortFundsByMaxRatio(funds);

    expect(sorted.map((item) => item.fundCode)).toEqual([
      '000003.OF',
      '000001.OF',
      '000002.OF',
    ]);
  });
});

describe('findFundByCode', () => {
  it('按基金代码精确查找', () => {
    const funds = [fund('000001.OF', 0.6)];
    expect(findFundByCode(funds, '000001.OF')?.fundName).toBe('基金000001.OF');
    expect(findFundByCode(funds, '000001')).toBeUndefined();
  });
});

describe('paginateFunds and getTotalPages', () => {
  it('按页码和每页条数切片', () => {
    const funds = [
      fund('000001.OF', 0.1),
      fund('000002.OF', 0.2),
      fund('000003.OF', 0.3),
    ];

    expect(paginateFunds(funds, 2, 1).map((item) => item.fundCode)).toEqual([
      '000002.OF',
    ]);
    expect(getTotalPages(3, 2)).toBe(2);
  });
});

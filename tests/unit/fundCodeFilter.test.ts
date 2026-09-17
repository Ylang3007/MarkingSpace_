import { describe, expect, it } from 'vitest';
import {
  matchFundCodes,
  normalizeFundCode,
  parseFundCodes,
} from '../../src/domain/fundCodeFilter';
import type { FundRecord } from '../../src/domain/fundTypes';

function fund(code: string): FundRecord {
  return {
    fundCode: code,
    fundName: `基金${code}`,
    manager: '测试基金管理有限公司',
    primaryCategory: '债券型基金',
    secondaryCategory: '中长期纯债型基金',
    fundScale: null,
    technologyFinanceRatio: 0,
    greenFinanceRatio: 0,
    inclusiveFinanceRatio: 0,
    pensionFinanceRatio: 0,
    digitalFinanceRatio: 0,
    coreLabels: [],
    relatedLabels: [],
  };
}

describe('normalizeFundCode', () => {
  it('去除首尾空格并转换为大写', () => {
    expect(normalizeFundCode('  014474.of  ')).toBe('014474.OF');
  });
});

describe('parseFundCodes', () => {
  it('支持中英文逗号、分号、空格和换行分隔，并去重', () => {
    const input = '014474.OF，004723.OF;014474.OF 010471.OF\n006032.OF';

    expect(parseFundCodes(input)).toEqual([
      '014474.OF',
      '004723.OF',
      '010471.OF',
      '006032.OF',
    ]);
  });

  it('移除空项', () => {
    expect(parseFundCodes('  ,；\n 014474.OF ')).toEqual(['014474.OF']);
  });
});

describe('matchFundCodes', () => {
  it('返回匹配和未匹配代码', () => {
    const funds = [fund('014474.OF'), fund('004723.OF')];
    const result = matchFundCodes(
      ['014474.OF', '004723.OF', '999999.OF'],
      funds,
    );

    expect(result.matchedCodes).toEqual(['014474.OF', '004723.OF']);
    expect(result.unmatchedCodes).toEqual(['999999.OF']);
  });
});

import { describe, expect, it } from 'vitest';
import { validateFundRecords } from '../../src/data/fundRecordValidation';
import type { FundRecord } from '../../src/domain/fundTypes';
import { computeLabels } from '../../src/domain/tagRules';

function fund(
  code: string,
  ratios = {
    technologyFinanceRatio: 0,
    greenFinanceRatio: 0,
    inclusiveFinanceRatio: 0,
    pensionFinanceRatio: 0,
    digitalFinanceRatio: 0,
  },
): FundRecord {
  const labels = computeLabels(ratios);
  return {
    fundCode: code,
    fundName: `基金${code}`,
    manager: '',
    primaryCategory: '',
    secondaryCategory: '',
    fundScale: null,
    ...ratios,
    coreLabels: labels.coreLabels,
    relatedLabels: labels.relatedLabels,
  };
}

describe('validateFundRecords', () => {
  it('基金代码重复时明确失败', () => {
    expect(() =>
      validateFundRecords([fund('000001.OF'), fund('000001.OF')]),
    ).toThrow(/000001\.OF/);
  });

  it('单项占比非法时能定位基金代码和字段', () => {
    const invalid = fund('000002.OF', {
      technologyFinanceRatio: 1.1,
      greenFinanceRatio: 0,
      inclusiveFinanceRatio: 0,
      pensionFinanceRatio: 0,
      digitalFinanceRatio: 0,
    });

    expect(() => validateFundRecords([invalid])).toThrow(
      /000002\.OF.*科技金融占比/,
    );
  });

  it('五类占比合计超过 100% 仍通过校验', () => {
    const valid = fund('000003.OF', {
      technologyFinanceRatio: 0.7,
      greenFinanceRatio: 0.6,
      inclusiveFinanceRatio: 0.1,
      pensionFinanceRatio: 0.2,
      digitalFinanceRatio: 0.3,
    });

    expect(() => validateFundRecords([valid])).not.toThrow();
  });
});

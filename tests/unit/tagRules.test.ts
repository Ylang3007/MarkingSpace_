import { describe, expect, it } from 'vitest';
import { computeLabels, getMaxRatio } from '../../src/domain/tagRules';
import type { FundRatios } from '../../src/domain/fundTypes';

function ratios(overrides: Partial<FundRatios> = {}): FundRatios {
  return {
    technologyFinanceRatio: 0,
    greenFinanceRatio: 0,
    inclusiveFinanceRatio: 0,
    pensionFinanceRatio: 0,
    digitalFinanceRatio: 0,
    ...overrides,
  };
}

describe('computeLabels', () => {
  it('把 50% 识别为核心标签', () => {
    const result = computeLabels(
      ratios({ technologyFinanceRatio: 0.5, greenFinanceRatio: 0.2 }),
    );

    expect(result.coreLabels).toEqual([
      { label: '科技金融', ratio: 0.5 },
    ]);
    expect(result.relatedLabels).toEqual([
      { label: '绿色金融', ratio: 0.2 },
    ]);
  });

  it('把恰好 20% 识别为关联标签', () => {
    const result = computeLabels(
      ratios({ pensionFinanceRatio: 0.2, digitalFinanceRatio: 0.199 }),
    );

    expect(result.relatedLabels).toEqual([
      { label: '养老金融', ratio: 0.2 },
    ]);
  });

  it('允许两个 50% 同时成为核心标签', () => {
    const result = computeLabels(
      ratios({ technologyFinanceRatio: 0.5, greenFinanceRatio: 0.5 }),
    );

    expect(result.coreLabels).toEqual([
      { label: '科技金融', ratio: 0.5 },
      { label: '绿色金融', ratio: 0.5 },
    ]);
    expect(result.relatedLabels).toEqual([]);
  });

  it('允许两个高于 50% 的核心标签同时存在，且合计可以超过 100%', () => {
    const result = computeLabels(
      ratios({
        technologyFinanceRatio: 0.7,
        greenFinanceRatio: 0.6,
        digitalFinanceRatio: 0.1,
      }),
    );

    expect(result.coreLabels).toEqual([
      { label: '科技金融', ratio: 0.7 },
      { label: '绿色金融', ratio: 0.6 },
    ]);
    expect(result.relatedLabels).toEqual([]);
  });

  it('无核心标签但存在关联标签', () => {
    const result = computeLabels(
      ratios({
        technologyFinanceRatio: 0.3,
        greenFinanceRatio: 0.1,
        digitalFinanceRatio: 0.25,
      }),
    );

    expect(result.coreLabels).toEqual([]);
    expect(result.relatedLabels).toEqual([
      { label: '科技金融', ratio: 0.3 },
      { label: '数字金融', ratio: 0.25 },
    ]);
  });

  it('无核心标签且无关联标签', () => {
    const result = computeLabels(
      ratios({
        technologyFinanceRatio: 0.19,
        greenFinanceRatio: 0.05,
        inclusiveFinanceRatio: 0,
        pensionFinanceRatio: 0.18,
        digitalFinanceRatio: 0,
      }),
    );

    expect(result.coreLabels).toEqual([]);
    expect(result.relatedLabels).toEqual([]);
  });

  it('低于 20% 不进入核心或关联标签', () => {
    const result = computeLabels(
      ratios({ digitalFinanceRatio: 0.19, inclusiveFinanceRatio: 0.05 }),
    );

    expect(result.coreLabels).toEqual([]);
    expect(result.relatedLabels).toEqual([]);
  });

  it('缺失占比归一化为 0 后不误判为标签', () => {
    const result = computeLabels(ratios());

    expect(result.coreLabels).toEqual([]);
    expect(result.relatedLabels).toEqual([]);
  });
});

describe('getMaxRatio', () => {
  it('返回五个占比中的最大值', () => {
    expect(
      getMaxRatio(
        ratios({
          technologyFinanceRatio: 0.1,
          greenFinanceRatio: 0.3,
          digitalFinanceRatio: 0.8,
        }),
      ),
    ).toBe(0.8);
  });
});

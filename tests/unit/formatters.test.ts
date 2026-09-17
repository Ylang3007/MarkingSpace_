import { describe, expect, it } from 'vitest';
import { formatFundScale } from '../../src/domain/formatters';

describe('formatFundScale', () => {
  it('整数显示两位小数', () => {
    expect(formatFundScale(12)).toBe('12.00');
  });

  it('一位或多位小数统一显示两位小数', () => {
    expect(formatFundScale(12.3)).toBe('12.30');
    expect(formatFundScale(12.345)).toBe('12.35');
  });

  it('空值显示 —', () => {
    expect(formatFundScale(null)).toBe('—');
    expect(formatFundScale(undefined)).toBe('—');
  });
});

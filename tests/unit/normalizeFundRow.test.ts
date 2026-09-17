import { describe, expect, it } from 'vitest';
import {
  buildFundRecord,
  parseFundScale,
  parseRatio,
  parseSourceLabels,
} from '../../src/data/normalizeFundRow';

describe('parseRatio', () => {
  it.each([
    [null, 0],
    [undefined, 0],
    ['', 0],
    ['NA', 0],
    ['N/A', 0],
    ['--', 0],
    [0.105, 0.105],
    ['0.105', 0.105],
    ['10.5%', 0.105],
  ])('解析 %s 为 %s', (input, expected) => {
    expect(parseRatio(input)).toBe(expected);
  });

  it('拒绝超过 1 的占比', () => {
    expect(() => parseRatio(1.2)).toThrow();
  });
});

describe('parseFundScale', () => {
  it.each([
    [null, null],
    [undefined, null],
    ['', null],
    ['NA', null],
    ['N/A', null],
    ['--', null],
  ])('将缺失值 %s 转为 null', (input, expected) => {
    expect(parseFundScale(input, '000001.OF', '基金规模（亿元）')).toBe(
      expected,
    );
  });

  it('保留有效数值', () => {
    expect(parseFundScale(12.345, '000001.OF', '基金规模（亿元）')).toBe(
      12.345,
    );
    expect(parseFundScale('12.345', '000001.OF', '基金规模（亿元）')).toBe(
      12.345,
    );
  });

  it('负数或无法解析的非空文本会终止并给出定位信息', () => {
    expect(() =>
      parseFundScale(-1, '000001.OF', '基金规模（亿元）'),
    ).toThrow(/000001\.OF/);
    expect(() =>
      parseFundScale('abc', '000001.OF', '基金规模（亿元）'),
    ).toThrow(/基金规模（亿元）/);
  });
});

describe('buildFundRecord', () => {
  it('只映射已配置字段，冗余列不进入基金记录', () => {
    const record = buildFundRecord((field) => {
      const row: Record<string, unknown> = {
        基金代码: '000001.OF',
        基金简称: '测试基金',
        管理人: '测试管理人',
        一级分类: '混合型基金',
        二级分类: '偏股混合型基金',
        科技金融占比: 0.58,
        绿色金融占比: 0.24,
        普惠金融占比: 0.08,
        养老金融占比: 0.05,
        数字金融占比: 0.52,
        内部备注: '不应进入结果',
        index: 1,
      };
      return row[field];
    });

    expect(record.fundCode).toBe('000001.OF');
    expect(record.coreLabels).toEqual([
      { label: '科技金融', ratio: 0.58 },
      { label: '数字金融', ratio: 0.52 },
    ]);
    expect(record.relatedLabels).toEqual([
      { label: '绿色金融', ratio: 0.24 },
    ]);
    expect('内部备注' in record).toBe(false);
    expect('index' in record).toBe(false);
  });

  it('缺失必填文本字段时能指出基金代码和字段', () => {
    expect(() =>
      buildFundRecord((field) => {
        const row: Record<string, unknown> = {
          基金代码: '000002.OF',
          基金简称: '',
          科技金融占比: 0.1,
          绿色金融占比: 0,
          普惠金融占比: 0,
          养老金融占比: 0,
          数字金融占比: 0,
        };
        return row[field];
      }),
    ).toThrow(/000002\.OF/);
  });

  it('单项占比非法时能指出基金代码和字段', () => {
    expect(() =>
      buildFundRecord((field) => {
        const row: Record<string, unknown> = {
          基金代码: '000003.OF',
          基金简称: '测试基金',
          管理人: '测试基金管理有限公司',
          一级分类: '混合型基金',
          二级分类: '偏股混合型基金',
          科技金融占比: 1.2,
          绿色金融占比: 0,
          普惠金融占比: 0,
          养老金融占比: 0,
          数字金融占比: 0,
        };
        return row[field];
      }),
    ).toThrow(/000003\.OF.*科技金融占比/);
  });
});

describe('parseSourceLabels', () => {
  it('读取核心标签1/2和关联标签1—3槽位', () => {
    const result = parseSourceLabels((field) => {
      const row: Record<string, unknown> = {
        核心标签1: '科技金融',
        核心标签占比1: 0.58,
        核心标签2: '数字金融',
        核心标签占比2: 0.52,
        关联标签1: '绿色金融',
        关联标签占比1: 0.24,
        关联标签2: null,
        关联标签占比2: null,
        关联标签3: null,
        关联标签占比3: null,
      };
      return row[field];
    });

    expect(result.coreLabels).toEqual([
      { label: '科技金融', ratio: 0.58 },
      { label: '数字金融', ratio: 0.52 },
    ]);
    expect(result.relatedLabels).toEqual([
      { label: '绿色金融', ratio: 0.24 },
    ]);
  });
});

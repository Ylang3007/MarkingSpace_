import { describe, expect, it } from 'vitest';
import {
  getMissingRequiredSourceFields,
  getRequiredSourceFields,
} from '../../src/config/sourceFields';

describe('sourceFields', () => {
  it('列出正式数据源实际存在的必填字段', () => {
    expect(getRequiredSourceFields()).toEqual([
      '基金代码',
      '基金简称',
      '管理人',
      '一级分类',
      '二级分类',
      '基金规模（亿元）',
      '科技金融占比',
      '绿色金融占比',
      '普惠金融占比',
      '养老金融占比',
      '数字金融占比',
    ]);
  });

  it('缺少任一必填表头时能明确列出', () => {
    const headers = [
      '基金代码',
      '基金简称',
      '科技金融占比',
      '绿色金融占比',
      '普惠金融占比',
      '养老金融占比',
      '基金规模（亿元）',
    ];

    expect(getMissingRequiredSourceFields(headers)).toEqual([
      '管理人',
      '一级分类',
      '二级分类',
      '数字金融占比',
    ]);
  });
});

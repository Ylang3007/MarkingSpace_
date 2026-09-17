import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  sortTagRatioItems,
  TagRatioList,
} from '../../src/components/TagRatioList';
import type { TagRatioItem } from '../../src/domain/fundTypes';

describe('sortTagRatioItems', () => {
  it('按占比从高到低排序，占比相同时按标签固定顺序', () => {
    const items: TagRatioItem[] = [
      { label: '绿色金融', ratio: 0.5 },
      { label: '科技金融', ratio: 0.7 },
      { label: '数字金融', ratio: 0.5 },
    ];

    expect(sortTagRatioItems(items)).toEqual([
      { label: '科技金融', ratio: 0.7 },
      { label: '绿色金融', ratio: 0.5 },
      { label: '数字金融', ratio: 0.5 },
    ]);
  });
});

describe('TagRatioList', () => {
  it('同一单元格内显示一个核心标签及占比', () => {
    const html = renderToStaticMarkup(
      <TagRatioList
        items={[{ label: '科技金融', ratio: 0.58 }]}
        emphasis="high"
        emptyText="暂无核心标签"
      />,
    );

    expect(html).toContain('科技金融');
    expect(html).toContain('58.0%');
  });

  it('同一单元格内显示两个核心标签及占比，并按占比排序', () => {
    const html = renderToStaticMarkup(
      <TagRatioList
        items={[
          { label: '数字金融', ratio: 0.52 },
          { label: '科技金融', ratio: 0.58 },
        ]}
        emphasis="high"
        emptyText="暂无核心标签"
      />,
    );

    expect(html.indexOf('科技金融')).toBeLessThan(html.indexOf('数字金融'));
    expect(html).toContain('58.0%');
    expect(html).toContain('52.0%');
  });

  it('空列表使用传入的空状态文案', () => {
    const html = renderToStaticMarkup(
      <TagRatioList
        items={[]}
        emphasis="high"
        emptyText="暂无核心标签"
      />,
    );

    expect(html).toContain('暂无核心标签');
  });
});

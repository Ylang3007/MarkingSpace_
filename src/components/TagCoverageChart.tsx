import type { EChartsOption } from 'echarts';
import { FINANCE_TAGS } from '../config/financeTags';
import type { TagCoverageStat } from '../domain/fundSelectors';
import { useEChart } from '../hooks/useEChart';

interface TooltipParam {
  seriesName?: string;
  dataIndex?: number;
}

function getColor(label: string, related: boolean): string {
  const tag = FINANCE_TAGS.find((item) => item.label === label);
  return tag ? (related ? tag.lightColor : tag.color) : '#6B7280';
}

export function TagCoverageChart({
  coverage,
}: {
  coverage: TagCoverageStat[];
}) {
  const option: EChartsOption = {
    grid: { left: 90, right: 52, top: 20, bottom: 20 },
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#6B7280' },
      splitLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: coverage.map((item) => item.label),
      axisLabel: { color: '#111827', fontSize: 14 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      textStyle: { color: '#111827' },
      formatter: (params: unknown) => {
        const list = Array.isArray(params)
          ? (params as TooltipParam[])
          : [params as TooltipParam];
        const index = list[0]?.dataIndex ?? 0;
        const stat = coverage[index];
        if (!stat) return '';
        return `${stat.label}<br/>核心标签覆盖：${stat.coreCount}<br/>关联标签覆盖：${stat.relatedCount}<br/>总覆盖：${stat.totalCount}`;
      },
    },
    series: [
      {
        name: '核心标签覆盖',
        type: 'bar',
        stack: 'coverage',
        barMaxWidth: 28,
        data: coverage.map((item) => ({
          value: item.coreCount,
          itemStyle: {
            color: getColor(item.label, false),
            borderRadius: [4, 0, 0, 4],
          },
        })),
      },
      {
        name: '关联标签覆盖',
        type: 'bar',
        stack: 'coverage',
        barMaxWidth: 28,
        data: coverage.map((item) => ({
          value: item.relatedCount,
          itemStyle: { color: getColor(item.label, true) },
        })),
      },
      {
        name: '总覆盖标签',
        type: 'bar',
        stack: 'coverage',
        silent: true,
        barMaxWidth: 28,
        itemStyle: { color: 'transparent' },
        emphasis: { disabled: true },
        label: {
          show: true,
          position: 'right',
          color: '#111827',
          formatter: (params: unknown) =>
            String(coverage[(params as { dataIndex: number }).dataIndex]?.totalCount ?? ''),
        },
        data: coverage.map((item) => ({ value: 0, total: item.totalCount })),
      },
    ],
  };

  const chartRef = useEChart(option);

  return <div ref={chartRef} className="h-[260px] w-full" />;
}

import type { EChartsOption } from 'echarts';
import { FINANCE_TAGS } from '../config/financeTags';
import type { FundRecord } from '../domain/fundTypes';
import { useEChart } from '../hooks/useEChart';
import { formatPercent } from '../utils/format';

export function FundRatioChart({ fund }: { fund: FundRecord }) {
  const coreLabels = new Set(fund.coreLabels.map((item) => item.label));

  const option: EChartsOption = {
    grid: { left: 100, right: 64, top: 20, bottom: 20 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      textStyle: { color: '#111827' },
      formatter: (params: unknown) => {
        const list = Array.isArray(params)
          ? (params as Array<{ name: string; value: number }>)
          : [params as { name: string; value: number }];
        const item = list[0];
        return `${item?.name ?? ''}：${formatPercent(item?.value ?? 0)}`;
      },
    },
    xAxis: {
      type: 'value',
      max: 1,
      min: 0,
      axisLabel: {
        color: '#6B7280',
        formatter: (value: number) => `${Math.round(value * 100)}%`,
      },
      splitLine: { lineStyle: { color: '#E5E7EB' } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: FINANCE_TAGS.map((tag) => tag.label),
      axisLabel: { color: '#111827', fontSize: 14 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 28,
        data: FINANCE_TAGS.map((tag) => ({
          value: fund[tag.field],
          itemStyle: {
            color: tag.color,
            borderRadius: [0, 4, 4, 0],
            borderColor: coreLabels.has(tag.label) ? '#111827' : 'transparent',
            borderWidth: coreLabels.has(tag.label) ? 2 : 0,
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: '#111827',
          formatter: (params: unknown) =>
            formatPercent((params as { value: number }).value ?? 0),
        },
      },
    ],
  };

  const chartRef = useEChart(option);

  return <div ref={chartRef} className="h-[400px] w-full" />;
}

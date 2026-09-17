import type { EChartsOption } from 'echarts';
import { FINANCE_TAGS } from '../config/financeTags';
import type { FundRecord } from '../domain/fundTypes';
import { useEChart } from '../hooks/useEChart';
import { formatPercent } from '../utils/format';

export function FundRadarChart({ fund }: { fund: FundRecord }) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      textStyle: { color: '#111827' },
      formatter: () =>
        FINANCE_TAGS.map(
          (tag) => `${tag.label}：${formatPercent(fund[tag.field])}`,
        ).join('<br/>'),
    },
    radar: {
      indicator: FINANCE_TAGS.map((tag) => ({
        name: tag.label,
        max: 1,
      })),
      radius: '66%',
      splitNumber: 5,
      axisName: {
        color: '#111827',
        fontSize: 14,
      },
      splitLine: { lineStyle: { color: '#E5E7EB' } },
      splitArea: {
        areaStyle: {
          color: ['#FFFFFF', '#F8FAFC'],
        },
      },
      axisLine: { lineStyle: { color: '#E5E7EB' } },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#1D4ED8', width: 2 },
        itemStyle: { color: '#1D4ED8' },
        areaStyle: { color: 'rgba(29, 78, 216, 0.22)' },
        data: [
          {
            name: fund.fundName,
            value: FINANCE_TAGS.map((tag) => fund[tag.field]),
          },
        ],
      },
    ],
  };

  const chartRef = useEChart(option);

  return <div ref={chartRef} className="h-[400px] w-full" />;
}

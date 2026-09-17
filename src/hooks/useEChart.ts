import { useEffect, useRef, type RefObject } from 'react';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useEChart(option: EChartsOption): RefObject<HTMLDivElement> {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = echarts.init(container);
    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    const reducedMotion = prefersReducedMotion();
    chartRef.current.setOption(
      {
        ...option,
        animation: !reducedMotion,
        animationDuration: reducedMotion ? 0 : 300,
        animationDurationUpdate: reducedMotion ? 0 : 200,
      },
      true,
    );
  }, [option]);

  return containerRef;
}

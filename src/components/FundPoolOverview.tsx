import { TagCoverageChart } from './TagCoverageChart';
import type { FundPoolOverview as OverviewData } from '../domain/fundSelectors';

interface StatCardProps {
  label: string;
  value: number;
  accent?: boolean;
  note?: string;
}

function StatCard({ label, value, accent = false, note }: StatCardProps) {
  return (
    <div
      className={`rounded-card border p-4 shadow-sm ${
        accent ? 'border-primary/20 bg-primary-soft' : 'border-line bg-surface'
      }`}
    >
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums text-ink">
        {value}
      </div>
      {note ? (
        <div className="mt-2.5 text-xs leading-[1.4] text-muted">{note}</div>
      ) : null}
    </div>
  );
}

export function FundPoolOverview({ overview }: { overview: OverviewData }) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="grid grid-cols-2 gap-4 lg:col-span-4">
        <StatCard label="基金总数" value={overview.total} accent />
        <StatCard label="具有核心标签的基金数" value={overview.coreCount} />
        <StatCard label="仅有关联标签的基金数" value={overview.relatedOnlyCount} />
        <StatCard
          label="暂无核心或关联标签的基金数"
          value={overview.noneCount}
          note="纯债型基金不涉及相关标签"
        />
      </div>
      <div className="rounded-card border border-line bg-surface p-5 shadow-sm lg:col-span-8">
        <h2 className="mb-4 text-base font-semibold text-ink">
          五类标签覆盖基金数
        </h2>
        <TagCoverageChart coverage={overview.coverage} />
      </div>
    </section>
  );
}

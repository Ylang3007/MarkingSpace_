import { PROJECT_CONFIG } from '../config/project';
import { useFundData } from '../data/FundDataProvider';
import { formatAsOfDate } from '../utils/format';

export function ProjectHeader() {
  const { data } = useFundData();
  const asOfDate = data?.meta.asOfDate ?? '';

  return (
    <header className="flex flex-col gap-2 rounded-card border border-line bg-surface px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-semibold leading-tight text-ink">
        {PROJECT_CONFIG.name}
      </h1>
      <div className="flex flex-col gap-1 text-sm text-muted sm:items-end">
        <span>{PROJECT_CONFIG.team}</span>
        <span>{formatAsOfDate(asOfDate)}</span>
      </div>
    </header>
  );
}

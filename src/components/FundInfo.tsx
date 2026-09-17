import { formatFundScale } from '../domain/formatters';
import type { FundRecord } from '../domain/fundTypes';

export function FundInfo({ fund }: { fund: FundRecord }) {
  const fundType = [fund.primaryCategory, fund.secondaryCategory]
    .filter(Boolean)
    .join(' · ');
  const fundTypeLabel = fundType || '—';
  const managerLabel = fund.manager || '—';
  const fundScaleText = formatFundScale(fund.fundScale);
  const fundScaleDisplay =
    fundScaleText === '—' ? fundScaleText : `${fundScaleText}亿元`;

  return (
    <section className="rounded-card border border-line bg-surface p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-ink">{fund.fundName}</h1>
      <div className="mt-1 text-sm tabular-nums text-muted">{fund.fundCode}</div>
      <dl className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-2">
          <dt className="text-sm text-muted">基金代码</dt>
          <dd className="mt-1 text-sm tabular-nums text-ink">{fund.fundCode}</dd>
        </div>
        <div className="xl:col-span-4">
          <dt className="text-sm text-muted">基金类型</dt>
          <dd className="mt-1 text-sm text-ink">{fundTypeLabel}</dd>
        </div>
        <div className="xl:col-span-4">
          <dt className="text-sm text-muted">基金管理人</dt>
          <dd className="mt-1 text-sm text-ink">{managerLabel}</dd>
        </div>
        <div className="xl:col-span-2">
          <dt className="text-sm text-muted">基金规模</dt>
          <dd className="mt-1 text-sm tabular-nums text-ink">
            {fundScaleDisplay}
          </dd>
        </div>
      </dl>
    </section>
  );
}

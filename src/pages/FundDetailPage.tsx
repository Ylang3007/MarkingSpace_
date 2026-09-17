import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackLink } from '../components/BackLink';
import { FundInfo } from '../components/FundInfo';
import { FundRadarChart } from '../components/FundRadarChart';
import { FundRatioChart } from '../components/FundRatioChart';
import { FundSwitcher } from '../components/FundSwitcher';
import { ProjectHeader } from '../components/ProjectHeader';
import { TagRatioList } from '../components/TagRatioList';
import { PROJECT_CONFIG } from '../config/project';
import { useFundData } from '../data/FundDataProvider';
import { findFundByCode } from '../domain/fundSelectors';

export function FundDetailPage() {
  const { fundCode = '' } = useParams();
  const { data, status, error, reload } = useFundData();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [fundCode]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-page px-4 py-6 text-ink sm:px-8">
        <div
          className="mx-auto space-y-6"
          style={{ maxWidth: PROJECT_CONFIG.maxContentWidth }}
        >
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-40 animate-pulse rounded-card bg-slate-100" />
          <div className="h-[400px] animate-pulse rounded-card bg-slate-100" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-page px-4 py-6 text-ink sm:px-8">
        <div
          className="mx-auto space-y-6"
          style={{ maxWidth: PROJECT_CONFIG.maxContentWidth }}
        >
          <ProjectHeader />
          <section className="rounded-card border border-line bg-surface p-8 text-center shadow-sm">
            <p className="text-ink">{error ?? '数据加载失败'}</p>
            <button
              type="button"
              onClick={reload}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              重新加载
            </button>
          </section>
        </div>
      </div>
    );
  }

  const fund = findFundByCode(data?.funds ?? [], fundCode);

  if (!fund) {
    return (
      <div className="min-h-screen bg-page px-4 py-6 text-ink sm:px-8">
        <div
          className="mx-auto space-y-6"
          style={{ maxWidth: PROJECT_CONFIG.maxContentWidth }}
        >
          <ProjectHeader />
          <section className="rounded-card border border-line bg-surface p-10 text-center shadow-sm">
            <h1 className="text-2xl font-semibold">未找到该基金</h1>
            <p className="mt-3 tabular-nums text-muted">{fundCode}</p>
            <div className="mt-6">
              <BackLink />
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page px-4 py-6 text-ink sm:px-8">
      <div
        className="mx-auto space-y-6"
        style={{ maxWidth: PROJECT_CONFIG.maxContentWidth }}
      >
        <BackLink />
        <ProjectHeader />
        <FundSwitcher />
        <FundInfo fund={fund} />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-medium text-muted">核心标签</h2>
            <div className="mt-2">
              <TagRatioList
                items={fund.coreLabels}
                emphasis="high"
                emptyText="暂无核心标签"
              />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted">关联标签</h2>
            <div className="mt-2">
              <TagRatioList
                items={fund.relatedLabels}
                emphasis="medium"
                emptyText="暂无关联标签"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="rounded-card border border-line bg-surface p-5 shadow-sm xl:col-span-5">
            <h2 className="mb-4 text-base font-semibold">五维标签雷达图</h2>
            <FundRadarChart fund={fund} />
          </div>
          <div className="rounded-card border border-line bg-surface p-5 shadow-sm xl:col-span-7">
            <h2 className="mb-4 text-base font-semibold">五类标签占比</h2>
            <FundRatioChart fund={fund} />
          </div>
        </section>
      </div>
    </div>
  );
}

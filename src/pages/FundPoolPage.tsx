import { useEffect, useMemo } from 'react';
import { FundCodeFilter } from '../components/FundCodeFilter';
import { FundPoolOverview } from '../components/FundPoolOverview';
import { FundTable } from '../components/FundTable';
import { Pagination } from '../components/Pagination';
import { ProjectHeader } from '../components/ProjectHeader';
import { SecondaryCategoryFilter } from '../components/SecondaryCategoryFilter';
import { TagFilters } from '../components/TagFilters';
import { useFundData } from '../data/FundDataProvider';
import {
  filterFunds,
  getFundPoolOverview,
  paginateFunds,
  sortFundsByMaxRatio,
} from '../domain/fundSelectors';
import { useFundPoolState } from '../state/FundPoolState';
import { PROJECT_CONFIG } from '../config/project';

function TableSkeleton() {
  return (
    <div className="space-y-2 rounded-card border border-line bg-surface p-5 shadow-sm">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded bg-slate-100" />
      ))}
    </div>
  );
}

export function FundPoolPage() {
  const { data, status, error, reload } = useFundData();
  const { state, setPage, setPageSize, clearAll, scrollYRef } =
    useFundPoolState();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: scrollYRef.current, behavior: 'auto' });
    });
  }, [scrollYRef]);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollYRef]);

  const funds = data?.funds ?? [];
  const overview = useMemo(() => getFundPoolOverview(funds), [funds]);
  const filtered = useMemo(
    () =>
      sortFundsByMaxRatio(
        filterFunds(funds, {
          fundCodes: state.activeFundCodes,
          fundCodeFilterApplied: state.fundCodeFilterApplied,
          secondaryCategories: state.secondaryCategories,
          coreTags: state.coreTags,
          relatedTags: state.relatedTags,
        }),
      ),
    [
      funds,
      state.activeFundCodes,
      state.fundCodeFilterApplied,
      state.secondaryCategories,
      state.coreTags,
      state.relatedTags,
    ],
  );
  const currentPageFunds = useMemo(
    () => paginateFunds(filtered, state.page, state.pageSize),
    [filtered, state.page, state.pageSize],
  );

  return (
    <div className="min-h-screen bg-page px-4 py-6 text-ink sm:px-8">
      <div
        className="mx-auto space-y-6"
        style={{ maxWidth: PROJECT_CONFIG.maxContentWidth }}
      >
        <ProjectHeader />

        {status === 'loading' && (
          <div className="space-y-6">
            <div className="h-32 animate-pulse rounded-card bg-slate-100" />
            <TableSkeleton />
          </div>
        )}

        {status === 'error' && (
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
        )}

        {status === 'ready' && funds.length === 0 && (
          <section className="rounded-card border border-line bg-surface p-8 text-center shadow-sm">
            <p className="text-ink">当前数据文件中暂无基金记录</p>
          </section>
        )}

        {status === 'ready' && funds.length > 0 && (
          <>
            <FundPoolOverview overview={overview} />
            <FundCodeFilter currentResultCount={filtered.length} />
            <SecondaryCategoryFilter />
            <TagFilters />

            {filtered.length > 0 ? (
              <>
                <FundTable funds={currentPageFunds} />
                <Pagination
                  page={state.page}
                  pageSize={state.pageSize}
                  total={filtered.length}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </>
            ) : (
              <section className="rounded-card border border-line bg-surface p-8 text-center shadow-sm">
                <p className="text-ink">未找到符合当前条件的基金</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-4 rounded-lg border border-line px-4 py-2 text-sm text-muted transition hover:border-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  清空筛选
                </button>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

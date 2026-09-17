import { getTotalPages } from '../domain/fundSelectors';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = getTotalPages(total, pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-muted">共 {total} 条结果</div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          每页
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          条
        </label>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-line px-3 py-1.5 text-ink transition hover:border-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            上一页
          </button>
          <span className="tabular-nums text-muted">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-line px-3 py-1.5 text-ink transition hover:border-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}

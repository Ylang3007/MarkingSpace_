import { useEffect, useMemo, useRef, useState } from 'react';
import { useFundData } from '../data/FundDataProvider';
import { getSecondaryCategoryOptions } from '../domain/fundSelectors';
import { useFundPoolState } from '../state/FundPoolState';

export function SecondaryCategoryFilter() {
  const { data } = useFundData();
  const { state, toggleSecondaryCategory, removeSecondaryCategory } =
    useFundPoolState();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const funds = data?.funds ?? [];
  const options = useMemo(
    () => getSecondaryCategoryOptions(funds),
    [funds],
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <section className="rounded-card border border-line bg-surface p-5 shadow-sm">
      <div className="text-sm font-medium text-ink">二级分类</div>
      <div ref={containerRef} className="relative mt-3">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          className="flex h-10 w-full max-w-[560px] items-center justify-between rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <span>
            已选 {state.secondaryCategories.length} 个二级分类
          </span>
          <span aria-hidden="true">{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-20 mt-2 max-h-64 w-full max-w-[560px] overflow-y-auto rounded-lg border border-line bg-surface p-2 shadow-lg">
            {options.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted">
                暂无二级分类选项
              </p>
            ) : (
              options.map((category) => {
                const checked = state.secondaryCategories.includes(category);
                return (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-ink hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSecondaryCategory(category)}
                      className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
                    />
                    <span>{category}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {state.secondaryCategories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {state.secondaryCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-sm text-ink"
            >
              二级分类：{category}
              <button
                type="button"
                onClick={() => removeSecondaryCategory(category)}
                className="ml-1 rounded-full px-1 text-muted hover:bg-line hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`移除二级分类${category}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

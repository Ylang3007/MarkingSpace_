import { useState, type KeyboardEvent } from 'react';
import { useFundData } from '../data/FundDataProvider';
import { matchFundCodes, parseFundCodes } from '../domain/fundCodeFilter';
import { useFundPoolState } from '../state/FundPoolState';

export function FundCodeFilter({
  currentResultCount,
}: {
  currentResultCount: number;
}) {
  const { data } = useFundData();
  const {
    state,
    setFundCodeInput,
    applyFundCodeFilter,
    clearFundCodeFilter,
  } = useFundPoolState();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const codes = parseFundCodes(state.fundCodeInput);
    if (codes.length === 0) {
      setError('请输入完整基金代码');
      return;
    }

    const result = matchFundCodes(codes, data?.funds ?? []);
    applyFundCodeFilter({
      inputCount: codes.length,
      matchedCodes: result.matchedCodes,
      unmatchedCodes: result.unmatchedCodes,
    });
    setError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const clearCodeFilter = () => {
    clearFundCodeFilter();
    setError(null);
  };

  const hasAppliedCodeFilter = state.inputFundCodeCount > 0;

  return (
    <section className="rounded-card border border-line bg-surface p-5 shadow-sm">
      <div className="flex w-full max-w-[720px] gap-2">
        <div className="relative flex-1">
          <label htmlFor="fund-code-filter" className="sr-only">
            基金代码筛选
          </label>
          <textarea
            id="fund-code-filter"
            value={state.fundCodeInput}
            onChange={(event) => {
              setFundCodeInput(event.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            rows={4}
            placeholder="输入一个或多个完整基金代码，可用逗号、空格或换行分隔"
            className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-sm leading-6 text-ink tabular-nums outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            筛选
          </button>
          <button
            type="button"
            onClick={clearCodeFilter}
            className="h-10 rounded-lg border border-line px-4 text-sm text-muted transition hover:border-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            清除代码
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted">
        普通 Enter 输入换行；Ctrl/Command + Enter 执行筛选
      </p>

      {hasAppliedCodeFilter && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span>
            输入{state.inputFundCodeCount}只基金，成功匹配
            {state.activeFundCodes.length}只，当前条件下显示
            {currentResultCount}只
          </span>
          {state.activeFundCodes.length > 0 && (
            <span className="inline-flex max-w-full flex-wrap gap-1.5">
              {state.activeFundCodes.map((code) => (
                <span
                  key={code}
                  className="rounded-full border border-line bg-slate-50 px-2 py-0.5 text-xs tabular-nums"
                >
                  {code}
                </span>
              ))}
            </span>
          )}
        </div>
      )}

      {state.unmatchedFundCodes.length > 0 && (
        <p className="mt-2 text-sm text-red-600">
          未找到：{state.unmatchedFundCodes.join('、')}，请检查输入是否正确。
        </p>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}

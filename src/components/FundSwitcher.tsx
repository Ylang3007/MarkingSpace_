import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFundData } from '../data/FundDataProvider';
import { normalizeFundCode } from '../domain/fundCodeFilter';
import { findFundByCode } from '../domain/fundSelectors';

export function FundSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useFundData();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeFundCode(input);

    if (!normalized) {
      setError('请输入完整基金代码');
      return;
    }

    const targetFund = findFundByCode(data?.funds ?? [], normalized);
    if (!targetFund) {
      setError(`未找到基金代码 ${normalized}，请检查输入是否正确。`);
      return;
    }

    setError(null);
    navigate(`/funds/${targetFund.fundCode}`, {
      replace: true,
      state: location.state ?? undefined,
    });
  };

  return (
    <section className="rounded-card border border-line bg-surface p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex w-full max-w-[480px] gap-2">
        <div className="relative flex-1">
          <label htmlFor="fund-switcher" className="sr-only">
            切换基金
          </label>
          <input
            id="fund-switcher"
            type="text"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setError(null);
            }}
            placeholder="输入完整基金代码，如 000001.OF"
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 pr-9 text-sm text-ink tabular-nums outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput('');
                setError(null);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="清除切换基金输入"
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          查看
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}

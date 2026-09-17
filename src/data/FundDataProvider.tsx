import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadFunds, resetFundsCache } from './loadFunds';
import type { FundDataPayload } from './fundSchema';

export type FundDataStatus = 'loading' | 'ready' | 'error';

interface FundDataContextValue {
  data: FundDataPayload | null;
  status: FundDataStatus;
  error: string | null;
  reload: () => void;
}

const FundDataContext = createContext<FundDataContextValue | null>(null);

export function FundDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FundDataPayload | null>(null);
  const [status, setStatus] = useState<FundDataStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const runLoad = () => {
    setStatus('loading');
    setError(null);
    loadFunds()
      .then((payload) => {
        setData(payload);
        setStatus('ready');
      })
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error ? loadError.message : '数据加载失败',
        );
        setStatus('error');
      });
  };

  useEffect(() => {
    runLoad();
  }, []);

  const value = useMemo<FundDataContextValue>(
    () => ({
      data,
      status,
      error,
      reload: () => {
        resetFundsCache();
        runLoad();
      },
    }),
    [data, status, error],
  );

  return (
    <FundDataContext.Provider value={value}>
      {children}
    </FundDataContext.Provider>
  );
}

export function useFundData(): FundDataContextValue {
  const context = useContext(FundDataContext);
  if (!context) {
    throw new Error('useFundData 必须在 FundDataProvider 内使用');
  }
  return context;
}

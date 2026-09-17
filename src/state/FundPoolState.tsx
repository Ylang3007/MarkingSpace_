import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';

export interface FundPoolState {
  fundCodeInput: string;
  activeFundCodes: string[];
  unmatchedFundCodes: string[];
  inputFundCodeCount: number;
  fundCodeFilterApplied: boolean;
  secondaryCategories: string[];
  coreTags: string[];
  relatedTags: string[];
  page: number;
  pageSize: number;
}

interface FundPoolStateContextValue {
  state: FundPoolState;
  scrollYRef: MutableRefObject<number>;
  setFundCodeInput: (value: string) => void;
  applyFundCodeFilter: (result: {
    inputCount: number;
    matchedCodes: string[];
    unmatchedCodes: string[];
  }) => void;
  clearFundCodeFilter: () => void;
  toggleSecondaryCategory: (category: string) => void;
  removeSecondaryCategory: (category: string) => void;
  toggleCoreTag: (label: string) => void;
  toggleRelatedTag: (label: string) => void;
  removeCoreTag: (label: string) => void;
  removeRelatedTag: (label: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  clearAll: () => void;
}

const FundPoolStateContext = createContext<FundPoolStateContextValue | null>(
  null,
);

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function FundPoolStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FundPoolState>({
    fundCodeInput: '',
    activeFundCodes: [],
    unmatchedFundCodes: [],
    inputFundCodeCount: 0,
    fundCodeFilterApplied: false,
    secondaryCategories: [],
    coreTags: [],
    relatedTags: [],
    page: 1,
    pageSize: 20,
  });
  const scrollYRef = useRef(0);

  const value = useMemo<FundPoolStateContextValue>(() => {
    const setFundCodeInput = (fundCodeInput: string) =>
      setState((current) => ({ ...current, fundCodeInput }));
    const applyFundCodeFilter = ({
      inputCount,
      matchedCodes,
      unmatchedCodes,
    }: {
      inputCount: number;
      matchedCodes: string[];
      unmatchedCodes: string[];
    }) =>
      setState((current) => ({
        ...current,
        inputFundCodeCount: inputCount,
        activeFundCodes: matchedCodes,
        unmatchedFundCodes: unmatchedCodes,
        fundCodeFilterApplied: true,
        page: 1,
      }));
    const clearFundCodeFilter = () =>
      setState((current) => ({
        ...current,
        fundCodeInput: '',
        activeFundCodes: [],
        unmatchedFundCodes: [],
        inputFundCodeCount: 0,
        fundCodeFilterApplied: false,
        page: 1,
      }));
    const toggleSecondaryCategory = (category: string) =>
      setState((current) => ({
        ...current,
        secondaryCategories: toggleValue(current.secondaryCategories, category),
        page: 1,
      }));
    const removeSecondaryCategory = (category: string) =>
      setState((current) => ({
        ...current,
        secondaryCategories: current.secondaryCategories.filter(
          (item) => item !== category,
        ),
        page: 1,
      }));
    const toggleCoreTag = (label: string) =>
      setState((current) => ({
        ...current,
        coreTags: toggleValue(current.coreTags, label),
        page: 1,
      }));
    const toggleRelatedTag = (label: string) =>
      setState((current) => ({
        ...current,
        relatedTags: toggleValue(current.relatedTags, label),
        page: 1,
      }));
    const removeCoreTag = (label: string) =>
      setState((current) => ({
        ...current,
        coreTags: current.coreTags.filter((item) => item !== label),
        page: 1,
      }));
    const removeRelatedTag = (label: string) =>
      setState((current) => ({
        ...current,
        relatedTags: current.relatedTags.filter((item) => item !== label),
        page: 1,
      }));
    const setPage = (page: number) =>
      setState((current) => ({ ...current, page }));
    const setPageSize = (pageSize: number) =>
      setState((current) => ({ ...current, pageSize, page: 1 }));
    const clearAll = () =>
      setState({
        fundCodeInput: '',
        activeFundCodes: [],
        unmatchedFundCodes: [],
        inputFundCodeCount: 0,
        fundCodeFilterApplied: false,
        secondaryCategories: [],
        coreTags: [],
        relatedTags: [],
        page: 1,
        pageSize: state.pageSize,
      });

    return {
      state,
      scrollYRef,
      setFundCodeInput,
      applyFundCodeFilter,
      clearFundCodeFilter,
      toggleSecondaryCategory,
      removeSecondaryCategory,
      toggleCoreTag,
      toggleRelatedTag,
      removeCoreTag,
      removeRelatedTag,
      setPage,
      setPageSize,
      clearAll,
    };
  }, [state]);

  return (
    <FundPoolStateContext.Provider value={value}>
      {children}
    </FundPoolStateContext.Provider>
  );
}

export function useFundPoolState(): FundPoolStateContextValue {
  const context = useContext(FundPoolStateContext);
  if (!context) {
    throw new Error('useFundPoolState 必须在 FundPoolStateProvider 内使用');
  }
  return context;
}

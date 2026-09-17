import { Navigate, Route, Routes } from 'react-router-dom';
import { FundDataProvider } from './data/FundDataProvider';
import { FundPoolStateProvider } from './state/FundPoolState';
import { FundPoolPage } from './pages/FundPoolPage';
import { FundDetailPage } from './pages/FundDetailPage';

export default function App() {
  return (
    <FundDataProvider>
      <FundPoolStateProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/funds" replace />} />
          <Route path="/funds" element={<FundPoolPage />} />
          <Route path="/funds/:fundCode" element={<FundDetailPage />} />
          <Route path="*" element={<Navigate to="/funds" replace />} />
        </Routes>
      </FundPoolStateProvider>
    </FundDataProvider>
  );
}

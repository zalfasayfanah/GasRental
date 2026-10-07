import { GasRentalProvider, useGasRental } from './context/GasRentalContext';
import { AppLayout } from './components/layout/AppLayout';
import { DasborPage } from './features/dasbor/DasborPage';
import { MotorPage } from './features/motor/MotorPage';
import { PenyewaPage } from './features/penyewa/PenyewaPage';
import { SewaPage } from './features/sewa/SewaPage';

function AppContent() {
  const { activeTab } = useGasRental();

  return (
    <AppLayout>
      {activeTab === 'dasbor' && <DasborPage />}
      {activeTab === 'motor' && <MotorPage />}
      {activeTab === 'penyewa' && <PenyewaPage />}
      {activeTab === 'sewa' && <SewaPage />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <GasRentalProvider>
      <AppContent />
    </GasRentalProvider>
  );
}

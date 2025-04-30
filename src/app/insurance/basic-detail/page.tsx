import { VehicleSelection } from '@/components/VehicleSelection';
import { Suspense } from 'react';
import { PolicyDetail } from './PolicyDetail';
interface PolicyDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PolicyDetailPage({ searchParams }: any) {
  const params = searchParams;
  const isManual = params?.manual === 'true' ? true : false;

  //selected vehicle from singpass page
  const selected_vehicle_singpass: VehicleSelection = {
    regNo: 'SPT1818T',
    make: 'BMW',
    model: '116d 1.5',
    first_registered_year: 2024,
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PolicyDetail
        isSingPassFlow={!isManual}
        selected_vehicle_singpass={selected_vehicle_singpass}
      />
    </Suspense>
  );
}

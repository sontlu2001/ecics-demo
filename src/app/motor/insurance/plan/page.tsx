'use client';

import PlanDetail from './PlanDetail';
import InsuranceLayout from '../InsuranceLayout';

function PlanPage({}) {
  return (
    <InsuranceLayout>
      {({ onSave }) => <PlanDetail onSaveRegister={onSave} />}
    </InsuranceLayout>
  );
}

export default PlanPage;

'use client';

import PlanDetail from './PlanDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';

function PlanPage({}) {
  return (
    <MaidInsuranceLayout>
      {({ onSave }) => <PlanDetail onSaveRegister={onSave} />}
    </MaidInsuranceLayout>
  );
}

export default PlanPage;

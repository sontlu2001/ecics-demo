'use client';

import PlanDetail from './PlanDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

function PlanPage({}) {
  return (
    <MotorInsuranceLayout>
      {({ onSave }) => <PlanDetail onSaveRegister={onSave} />}
    </MotorInsuranceLayout>
  );
}

export default PlanPage;

'use client';

import AddOnDetail from './AddonDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

export default function AddonPage() {
  return (
    <MotorInsuranceLayout>
      {({ onSave }) => <AddOnDetail onSaveRegister={onSave} />}
    </MotorInsuranceLayout>
  );
}

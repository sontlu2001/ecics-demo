'use client';

import InsuranceLayout from '../InsuranceLayout';
import AddOnBonusDetailManualForm from './AddOnBonusDetailManualForm';

export default function AddonPage() {
  return (
    <InsuranceLayout>
      {({ onSave }) => <AddOnBonusDetailManualForm onSaveRegister={onSave} />}
    </InsuranceLayout>
  );
}

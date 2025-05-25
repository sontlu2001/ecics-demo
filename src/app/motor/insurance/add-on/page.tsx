'use client';

import AddOnDetail from './AddonDetail';
import InsuranceLayout from '../InsuranceLayout';

export default function AddonPage() {
  return (
    <InsuranceLayout>
      {({ onSave }) => <AddOnDetail onSaveRegister={onSave} />}
    </InsuranceLayout>
  );
}

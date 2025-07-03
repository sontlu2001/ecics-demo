'use client';

import AddOnDetail from './AddonDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';

export default function AddonPage() {
  return (
    <MaidInsuranceLayout>
      {({ onSave }) => <AddOnDetail onSaveRegister={onSave} />}
    </MaidInsuranceLayout>
  );
}

'use client';

import HelpersDetail from './HelpersDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';

export default function AddonPage() {
  return (
    <MaidInsuranceLayout>
      {({ onSave }) => <HelpersDetail onSaveRegister={onSave} />}
    </MaidInsuranceLayout>
  );
}

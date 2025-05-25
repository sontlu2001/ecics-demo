'use client';

import { Checkbox, Drawer, Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useState } from 'react';

import { PrimaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

function SelfDeclarationConfirmModal({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean;
  onOk: () => void;
  onCancel?: () => void;
}) {
  const { isMobile } = useDeviceDetection();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setIsChecked(e.target.checked);
  };

  const handleOkayClick = () => {
    onOk();
  };

  const content = (
    <div className='flex flex-col justify-between'>
      <div>
        <p className='text-center text-base font-bold'>Self Declaration</p>
        <div className='mt-4 text-sm'>
          <ul className='list-disc pl-4 text-justify'>
            <li>
              You are a resident of Singapore possessing a valid FIN or NRIC;
            </li>
            <li>
              You have not been revoked or suspended driving license in the last
              3 years, or never been convicted of DUI (Driving Under the
              Influence) or DWI (Driving While Intoxicated);
            </li>
            <li>You are holding a valid Singapore driving license;</li>
            <li>Your car is not used for any rental purposes;</li>
            <li>Your car is in roadworthy condition within LTA guidelines;</li>
            <li>
              Your car is a private car used for the purpose of
              leisure/commuting only, and is not used to deliver goods or
              passengers as part of your job or in exchange for financial
              rewards;
            </li>
            <li>
              You have not had 3 or more claims made against your car insurance.
            </li>
          </ul>
        </div>
      </div>
      <div className='mt-4 flex items-start gap-2 text-sm'>
        <Checkbox
          className='custom-checkbox'
          checked={isChecked}
          onChange={handleCheckboxChange}
          id='self-declaration-checkbox'
        />
        <label
          className='cursor-pointer text-justify font-semibold'
          htmlFor='self-declaration-checkbox'
        >
          I confirm that I have read and meet all the above eligibility
          criteria.
        </label>
      </div>
      <div className='mt-6 flex justify-center'>
        <PrimaryButton
          onClick={handleOkayClick}
          className='w-full py-3 text-base font-semibold text-white'
          disabled={!isChecked}
        >
          Okay
        </PrimaryButton>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={onCancel}
        closable={false}
        height='auto'
        className='rounded-t-xl'
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Modal
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      closable={true}
      maskClosable={true}
      keyboard={true}
      footer={null}
      centered
    >
      {content}
    </Modal>
  );
}

export default SelfDeclarationConfirmModal;

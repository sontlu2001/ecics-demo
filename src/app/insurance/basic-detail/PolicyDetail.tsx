'use client';

import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { adjustDateInDate } from '@/libs/utils/date-utils';

import {
  VehicleSelection,
  VehicleSelectionModal,
} from '@/components/VehicleSelection';

import { MOTOR_QUOTE } from '@/constants';

import PolicyDetailForm from './PolicyDetailForm';
import { PromoCodeModel } from '../components/PromoCode';
import VehicleBar from '../components/VehicleBar';

export const PolicyDetail = () => {
  const defaultPromoCode = { code: 'string', desc: 'string' };
  const [visible, setVisible] = useState(false);
  const [appliedPromoCode, setPromoCode] = useState<PromoCodeModel | null>(
    defaultPromoCode ? defaultPromoCode : null,
  );
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSelection>(
    {} as VehicleSelection,
  );
  const vehicles: VehicleSelection[] = [
    {
      regNo: 'SBA2828T',
      vehMake: 'MERCEDES BENZ',
      vehModel: 'MAYBACH GLA650',
      regYear: '2025',
    },
    { regNo: 'STJ2923J', vehMake: 'BMW', vehModel: 'Q5 2.2', regYear: '2024' },
  ];

  const initialValues = {
    [MOTOR_QUOTE.quick_quote_email]: 'test@gmail.com',
    [MOTOR_QUOTE.quick_quote_mobile]: '88889999',
    [MOTOR_QUOTE.quick_proposal_start_date]: new Date(),
    [MOTOR_QUOTE.quick_proposal_end_date]: adjustDateInDate(
      new Date(),
      1,
      0,
      -1,
    ),
  };

  const test = () => {
    console.log('ok');
  };

  const handleRemovePromoCode = () => {
    setPromoCode(null);
  };

  const onEditClick = () => {
    setVisible(true);
    console.log('click');
  };

  const handleSelection = (selected: VehicleSelection | null) => {
    if (selected) {
      setSelectedVehicle(selected);
    }
    setVisible(false);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log('submitted');
      console.log(data); // Form data after validation
    } catch (error) {
      console.error('Submission error:', error);
    }
  };
  return (
    <>
      <div className='px-4 md:px-12'>
        <div className='my-6 grid gap-4 lg:grid-cols-3'>
          <div className='mx-auto w-full sm:max-w-[50%] lg:col-span-1 lg:col-start-2 lg:max-w-none'>
            <VehicleBar
              regNo={selectedVehicle?.regNo}
              vehMake={selectedVehicle?.vehMake}
              vehModel={selectedVehicle?.vehModel}
              regYear={2024}
              onClick={onEditClick}
            ></VehicleBar>
          </div>
        </div>
        <PolicyDetailForm
          onSubmit={onSubmit}
          veh_make_model_list={[
            { value: 'BMW | 116d 1.5', text: 'BMW 116d 1.5' },
            {
              value: 'MERCEDES BENZ | A200 AMG Line 1.4',
              text: 'MERCEDES BENZ A200 AMG Line 1.4',
            },
          ]}
          hire_purchase_list={[
            '-- Others (Not Available in this list) --',
            'DBS',
            'POSB',
          ]}
          isSingpassFlow={false}
          handleInputChange={test}
          handleRemovePromoCode={handleRemovePromoCode}
          appliedPromoCode={appliedPromoCode}
          defaultPromoCode={defaultPromoCode}
          // appliedPromoCode={appliedPromoCode}
          initialValues={initialValues}
        ></PolicyDetailForm>
      </div>
      <VehicleSelectionModal
        vehicles={vehicles}
        visible={visible}
        onSubmit={handleSelection}
      />
    </>
  );
};

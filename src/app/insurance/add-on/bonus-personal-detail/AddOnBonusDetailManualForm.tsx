'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { DropdownField } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';

import AddOnPricingSummary from '@/app/insurance/add-on/AddOnPricingSummary';
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '@/app/insurance/basic-detail/options';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const createSchema = () =>
  z.object({
    name: z.string().min(1, 'Name is required'),
    nric: z.string().min(1, 'NRIC/FIN is required'),
    gender: z.string().min(1, 'Gender is required'),
    maritalStatus: z.string().min(1, 'Marital status is required'),
    address: z.string().min(1, 'Address is required'),
    pinCode: z.string().min(1, 'Pin code is required'),
    chasisNumber: z.string().min(1, 'Chasis number is required'),
    engineNumber: z.string().min(1, 'Engine number is required'),
    vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

const AddOnBonusDetailManualForm = () => {
  const { isMobile } = useDeviceDetection();
  const [form] = Form.useForm();
  const schema = useMemo(() => createSchema(), []);
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const {
    formState: { errors },
  } = methods;

  const handleSubmit = (data: FormData) => {
    console.log('Submitted data:', data);
  };

  return (
    <FormProvider {...methods}>
      <Form
        form={form}
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
        }}
        onFinish={methods.handleSubmit(handleSubmit)}
        className='w-full'
      >
        {/* MyInfo block */}
        {/*<div*/}
        {/*    className={`w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm ${isMobile ? '' : 'mt-[8px]'}`}>*/}
        {/*    <div className='text-lg font-bold'>Save Time with Myinfo</div>*/}
        {/*    <div className={`mb-[20px] ${!isMobile ? 'flex flex-row items-center justify-between' : ''}`}>*/}
        {/*        <div className={`mb-4 sm:mb-0 ${!isMobile ? '' : 'text-justify'}`}>*/}
        {/*            Use Myinfo and instantly autofill your information securely with Myinfo, saving time and*/}
        {/*            ensuring accuracy.*/}
        {/*        </div>*/}
        {/*        <button type="button"*/}
        {/*                className='flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg shadow-black/20'>*/}
        {/*            <p className='text-xl font-semibold'>Retrieve Myinfo with</p>*/}
        {/*            <Image src='/singpass.svg' alt='Logo' width={100} height={100} className='pt-2'/>*/}
        {/*        </button>*/}
        {/*    </div>*/}
        {/*</div>*/}

        {/* Personal Details */}
        <div
          className={`w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm ${isMobile ? '' : 'mt-[14px]'}`}
        >
          <div className={`text-lg font-bold ${isMobile ? 'mt-[28px]' : ''}`}>
            Enter Personal Details
          </div>
          <div className='grid gap-y-2 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
            <Form.Item
              name='name'
              validateStatus={errors['name'] ? 'error' : ''}
              help={errors['name']?.message}
            >
              <InputField
                name='name'
                label='Name as Per NRIC'
                placeholder='Enter your Name'
              />
            </Form.Item>

            <Form.Item
              name='nric'
              validateStatus={errors['nric'] ? 'error' : ''}
              help={errors['nric']?.message}
            >
              <InputField
                name='nric'
                label='NRIC/FIN'
                placeholder='Enter NRIC/FIN'
              />
            </Form.Item>

            <Form.Item
              name='gender'
              validateStatus={errors['gender'] ? 'error' : ''}
              help={errors['gender']?.message}
            >
              <DropdownField
                name='gender'
                label='Gender'
                placeholder='Select gender'
                options={GENDER_OPTIONS}
              />
            </Form.Item>

            <Form.Item
              name='maritalStatus'
              validateStatus={errors['maritalStatus'] ? 'error' : ''}
              help={errors['maritalStatus']?.message}
            >
              <DropdownField
                name='maritalStatus'
                label='Marital Status'
                placeholder='Select marital status'
                options={MARITAL_STATUS_OPTIONS}
              />
            </Form.Item>

            <Form.Item
              name='address'
              validateStatus={errors['address'] ? 'error' : ''}
              help={errors['address']?.message}
            >
              <InputField
                name='address'
                label='Address'
                placeholder='Enter Address'
              />
            </Form.Item>

            <Form.Item
              name='pinCode'
              validateStatus={errors['pinCode'] ? 'error' : ''}
              help={errors['pinCode']?.message}
            >
              <InputField
                name='pinCode'
                label='Pin Code'
                placeholder='Enter Pin Code'
              />
            </Form.Item>
          </div>
        </div>

        {/* Vehicle Details */}
        <div
          className={`w-full sm:rounded-lg sm:border sm:border-blue-400 sm:bg-gray-100/50 sm:p-4 sm:backdrop-blur-sm ${isMobile ? '' : 'mt-[14px]'}`}
        >
          <div className={`text-lg font-bold ${isMobile ? 'mt-[6px]' : ''}`}>
            Enter Vehicle Details
          </div>
          <div className='grid gap-y-2 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
            <Form.Item
              name='chasisNumber'
              validateStatus={errors['chasisNumber'] ? 'error' : ''}
              help={errors['chasisNumber']?.message}
            >
              <InputField
                name='chasisNumber'
                label='Chasis Number'
                placeholder='Enter Chasis Number'
              />
            </Form.Item>

            <Form.Item
              name='engineNumber'
              validateStatus={errors['engineNumber'] ? 'error' : ''}
              help={errors['engineNumber']?.message}
            >
              <InputField
                name='engineNumber'
                label='Engine Number'
                placeholder='Enter Engine Number'
              />
            </Form.Item>

            <Form.Item
              name='vehicleNumber'
              validateStatus={errors['vehicleNumber'] ? 'error' : ''}
              help={errors['vehicleNumber']?.message}
            >
              <InputField
                name='vehicleNumber'
                label='Vehicle Number'
                placeholder='Enter Vehicle Number'
              />
            </Form.Item>
          </div>
        </div>
        <AddOnPricingSummary onContinue={methods.handleSubmit(handleSubmit)} />
      </Form>
    </FormProvider>
  );
};

export default AddOnBonusDetailManualForm;

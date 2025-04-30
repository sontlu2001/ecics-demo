'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import WarningIcon from '@/components/icons/WarningIcon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

import ConfirmInfoModalWrapper from '@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';

// Zod schema
const reviewInfoSchema = z.object({
  email: z.string().regex(emailRegex, 'Please enter a valid email address.'),
  phoneNumber: z
    .string()
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  name: z.string().min(1, 'Required'),
  nric: z.string().min(1, 'Required'),
  gender: z.string().min(1, 'Required'),
  maritalStatus: z.string().min(1, 'Required'),
  dob: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  vehicleMake: z.string().min(1, 'Required'),
  vehicleYear: z.string().min(4, 'Enter a valid year'),
  chassisNumber: z.string().min(1, 'Required'),
});

type ReviewInfoForm = z.infer<typeof reviewInfoSchema>;

const ManualReviewInfoDetail = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const methods = useForm<ReviewInfoForm>({
    resolver: zodResolver(reviewInfoSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      name: '',
      nric: '',
      gender: '',
      maritalStatus: '',
      dob: '',
      address: '',
      vehicleMake: '',
      vehicleYear: '',
      chassisNumber: '',
    },
  });

  const handleContinue = () => {
    router.push(ROUTES.INSURANCE.BASIC_DETAIL_SINGPASS);
  };

  const handleCancel = () => {
    setShowConfirmModal(true);
  };

  const boxWrapperClass =
    'mt-6 rounded-md border border-gray-300 bg-gray-100 p-4';

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='relative z-10 flex-grow p-6'>
        <div className='flex items-center justify-between'>
          <Image src='/ecics.svg' alt='Logo' width={100} height={100} />
          <Image src='/singpass.svg' alt='Logo' width={170} height={170} />
        </div>
        <div className='mt-6 text-lg font-bold'>Review your Myinfo details</div>
        <FormProvider {...methods}>
          <Form
            onFinish={methods.handleSubmit(handleContinue)}
            className='w-full'
            scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
          >
            <div className='w-full'>
              {/* Email & Phone */}
              <div className={`${boxWrapperClass}`}>
                <div className='flex items-center justify-between'>
                  <div className='text-base font-bold'>
                    Enter a valid Email and Contact Number
                  </div>
                  <div className='flex items-center justify-between font-bold'>
                    <WarningIcon size={14} />
                    <div className='ml-[2px] text-[10px]'>
                      Why do we need this?
                    </div>
                  </div>
                </div>
                <div className='mt-4 flex items-center justify-between'>
                  <div className='w-[calc(50%-10px)]'>
                    <div className='text-sm font-bold'>Email Address</div>
                    <InputField name='email' placeholder='abc@gmail.com' />
                  </div>
                  <div className='w-[calc(50%-10px)]'>
                    <div className='text-sm font-bold'>Phone Number</div>
                    <InputField name='phoneNumber' placeholder='+65 98888888' />
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className={`${boxWrapperClass} mt-4`}>
                <div className='text-base font-bold underline-offset-4'>
                  Personal Info
                </div>
                <div className='mt-2 flex flex-wrap gap-4'>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>Name as per NRIC</div>
                    <InputField name='name' placeholder='Sayan Chakraborty' />
                  </div>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>NRIC</div>
                    <InputField name='nric' placeholder='ABC1234' />
                  </div>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>Gender</div>
                    <InputField name='gender' placeholder='Male' />
                  </div>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>Marital Status</div>
                    <InputField name='maritalStatus' placeholder='Married' />
                  </div>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>Date of Birth</div>
                    <InputField name='dob' placeholder='29/12/1990' />
                  </div>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>Address</div>
                    <InputField
                      name='address'
                      placeholder='10 Eunos Road Singapore 400087'
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className={`${boxWrapperClass} mt-4`}>
                <div className='text-base font-bold underline-offset-4'>
                  Vehicle Details
                </div>
                <div className='mt-2 flex flex-wrap gap-4'>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>Vehicle Make</div>
                    <InputField name='vehicleMake' placeholder='BMW i5 2.5' />
                  </div>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>
                      Year of Registration
                    </div>
                    <InputField name='vehicleYear' placeholder='2024' />
                  </div>
                  <div className='min-w-[30%] flex-1'>
                    <div className='text-sm font-bold'>Chassis Number</div>
                    <InputField name='chassisNumber' placeholder='234GH3' />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </FormProvider>
      </div>

      <div className='flex justify-center gap-4 border-t bg-white p-4'>
        <SecondaryButton
          onClick={handleCancel}
          className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={methods.handleSubmit(handleContinue)}
          className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
        >
          Continue
        </PrimaryButton>
      </div>

      {showConfirmModal && (
        <ConfirmInfoModalWrapper
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
        />
      )}
    </div>
  );
};

export default ManualReviewInfoDetail;

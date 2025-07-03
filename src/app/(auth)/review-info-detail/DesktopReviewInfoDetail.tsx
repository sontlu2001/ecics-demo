'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { generateYearOptions } from '@/libs/utils/utils';

import WarningIcon from '@/components/icons/WarningIcon';
import { DatePickerField } from '@/components/ui/form/datepicker';
import {
  DropdownField,
  DropdownOption,
} from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';
import { TextAreaField } from '@/components/ui/form/textareafield';

import { emailRegex, phoneRegex } from '@/constants/validation.constant';

// Schema
const reviewInfoSchema = z.object({
  personal: z.object({
    nameAsPerNric: z.string().min(1, 'Required'),
    nric: z.string().min(1, 'Required'),
    gender: z.string().min(1, 'Required'),
    maritalStatus: z.string().min(1, 'Required'),
    dateOfBirth: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
  }),
  email: z.string().regex(emailRegex, 'Please enter a valid email address.'),
  phone: z
    .string()
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  vehicle: z.object({
    vehicleMake: z.string().min(1, 'Required'),
    yearOfRegistration: z.string().min(4, 'Enter a valid year'),
    chassisNumber: z.string().min(1, 'Required'),
  }),
});

type ReviewInfoForm = z.infer<typeof reviewInfoSchema>;

interface LabelValuePair {
  label: string;
  value: string;
}

interface DesktopReviewInfoDetailProps {
  commonInfo: {
    email: string;
    phone: string;
    personal: LabelValuePair[];
    vehicle: LabelValuePair[];
  };
}

const formatKey = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]/gi, '');

const LabeledInputField = ({
  label,
  name,
  disabled = true,
}: {
  label: string;
  name: string;
  disabled?: boolean;
}) => (
  <div className='min-w-[30%] flex-1'>
    <div className='text-sm font-bold'>{label}</div>
    <InputField name={name} disabled={disabled} />
  </div>
);

const isReadOnly = true;

const DesktopReviewInfoDetail = ({
  commonInfo,
}: DesktopReviewInfoDetailProps) => {
  const personalInfo = (commonInfo.personal ?? []).reduce<
    Record<string, string>
  >((acc, { label, value }) => {
    acc[formatKey(label)] = value;
    return acc;
  }, {});

  const vehicleInfo = (commonInfo.vehicle ?? []).reduce<Record<string, string>>(
    (acc, { label, value }) => {
      acc[formatKey(label)] = value;
      return acc;
    },
    {},
  );

  const regYearOptions: DropdownOption[] = generateYearOptions();

  const genderOptions: DropdownOption[] = [
    { value: 'Male', text: 'Male' },
    { value: 'Female', text: 'Female' },
  ];

  const maritalStatusOptions: DropdownOption[] = [
    { value: 'Married', text: 'Married' },
    { value: 'Single', text: 'Single' },
    { value: 'Widowed', text: 'Widowed' },
    { value: 'Divorced', text: 'Divorced' },
  ];

  const methods = useForm<ReviewInfoForm>({
    resolver: zodResolver(reviewInfoSchema),
    defaultValues: {
      email: commonInfo.email,
      phone: commonInfo.phone,
      personal: personalInfo,
      vehicle: vehicleInfo,
    },
  });

  const boxWrapperClass =
    'mt-6 rounded-md border border-gray-300 bg-gray-100 p-4';

  return (
    <div className='flex flex-col'>
      <div className='relative z-10 flex-grow'>
        <FormProvider {...methods}>
          <div className='w-full'>
            {/* Email & Phone */}
            <div className={`${boxWrapperClass}`}>
              <div className='flex items-center justify-between'>
                <div className='text-base font-bold'>
                  Enter a valid Email and Contact Number
                </div>
                <Tooltip title='We use this information to verify your identity and pre-fill your application with accurate government-verified data. This helps ensure a faster, more secure, and seamless submission process.'>
                  <span className='flex cursor-pointer items-center font-bold'>
                    <WarningIcon size={14} />
                    <span className='ml-1 text-[10px]'>
                      Why do we need this?
                    </span>
                  </span>
                </Tooltip>
              </div>
              <div className='mt-4 flex gap-4'>
                <LabeledInputField label='Email Address' name='email' />
                <LabeledInputField label='Phone Number' name='phone' />
              </div>
            </div>

            {/* Personal Info */}
            <div className={`${boxWrapperClass} mt-4`}>
              <div className='text-base font-bold underline-offset-4'>
                Personal Info
              </div>
              <div className='mt-2 flex flex-wrap gap-4'>
                <LabeledInputField
                  label='Name as per NRIC'
                  name='personal.nameaspernric'
                />
                <LabeledInputField label='NRIC' name='personal.nric' />
                <div className='min-w-[30%] flex-1'>
                  <div className='text-sm font-bold'>Gender</div>
                  <DropdownField
                    name='personal.gender'
                    options={genderOptions}
                    disabled={isReadOnly}
                  />
                </div>
                <div className='min-w-[30%] flex-1'>
                  <div className='text-sm font-bold'>Marital Status</div>
                  <DropdownField
                    name='personal.maritalstatus'
                    options={maritalStatusOptions}
                    disabled={isReadOnly}
                  ></DropdownField>
                </div>
                <div className='min-w-[30%] flex-1'>
                  <div className='text-sm font-bold'>Date of Birth</div>
                  <DatePickerField
                    name='personal.dateofbirth'
                    disabled={isReadOnly}
                    minDate={dayjs().startOf('day').subtract(70, 'years')}
                    maxDate={dayjs().startOf('day').subtract(25, 'years')}
                  />
                </div>
                <div className='min-w-[30%] flex-1'>
                  <div className='text-sm font-bold'>Address</div>
                  <TextAreaField
                    name='personal.address'
                    rows={4}
                    disabled={isReadOnly}
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
                <LabeledInputField
                  label='Vehicle Make'
                  name='vehicle.vehiclemake'
                />
                <div className='min-w-[30%] flex-1'>
                  <div className='text-sm font-bold'>Year of Registration</div>
                  <DropdownField
                    name='vehicle.yearofregistration'
                    options={regYearOptions}
                    disabled={isReadOnly}
                  ></DropdownField>
                </div>
                <LabeledInputField
                  label='Chassis Number'
                  name='vehicle.chassisnumber'
                />
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default DesktopReviewInfoDetail;

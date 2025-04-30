'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

import ConfirmInfoModalWrapper from '@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper';
import { ECICS_USER_INFO } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import InfoSection from './InfoSection';
import { capitalizeWords } from '@/libs/utils/utils';

const reviewInfoSchema = z.object({
  email: z.string().regex(emailRegex, 'Please enter a valid email address.'),
  phone: z
    .string()
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
});

type ReviewInfoForm = z.infer<typeof reviewInfoSchema>;

const ReviewInfoDetail = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isMobile } = useDeviceDetection();
  const [commonInfo, setCommonInfo] = useState<any>(null);
  const router = useRouter();

  const methods = useForm<ReviewInfoForm>({
    resolver: zodResolver(reviewInfoSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  });

  const handleContinue = () => {
    router.push(ROUTES.INSURANCE.BASIC_DETAIL_SINGPASS);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(true);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    if (stored) {
      const parsed = JSON.parse(stored);

      const transformed = {
        email: parsed.email?.value || '',
        phone: `${parsed.mobileno?.prefix?.value || ''}${parsed.mobileno?.areacode?.value || ''} ${parsed.mobileno?.nbr?.value || ''}`,
        personal: [
          {
            label: 'Name as per NRIC',
            value: capitalizeWords(parsed.name?.value) || '',
          },
          {
            label: 'NRIC',
            value: parsed.uinfin?.value || '',
          },
          {
            label: 'Gender',
            value: capitalizeWords(parsed.sex?.desc) || '',
          },
          {
            label: 'Marital Status',
            value: capitalizeWords(parsed.marital?.desc) || '',
          },
          {
            label: 'Date of Birth',
            value: parsed.dob?.value
              ? new Date(parsed.dob.value).toLocaleDateString('en-GB')
              : '',
          },
          {
            label: 'Address',
            value: [
              capitalizeWords(parsed.regadd?.block?.value || ''),
              capitalizeWords(parsed.regadd?.street?.value || ''),
              parsed.regadd?.floor?.value || parsed.regadd?.unit?.value
                ? `#${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}`
                : '',
              capitalizeWords(parsed.regadd?.building?.value || ''),
              capitalizeWords(parsed.regadd?.country?.desc || 'Singapore'),
              parsed.regadd?.postal?.value,
            ]
              .filter(Boolean)
              .join(' ')
              .trim(),
          },
        ],
        vehicle:
          parsed.vehicles
            ?.map((v: any) => [
              {
                label: 'Vehicle Make',
                value: capitalizeWords(
                  `${v.make?.value || ''} ${v.model?.value || ''}`,
                ).trim(),
              },
              {
                label: 'Year of Registration',
                value: v.firstregistrationdate?.value
                  ? new Date(v.firstregistrationdate.value)
                      .getFullYear()
                      .toString()
                  : '',
              },
              {
                label: 'Chassis Number',
                value: v.vehicleno?.value || '',
              },
            ])
            .flat() || [],
      };
      setCommonInfo(transformed);
      methods.reset({
        email: transformed.email,
        phone: transformed.phone,
      });
    }
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <div className='flex min-h-screen flex-col'>
        <div className='relative z-10 flex-grow p-6'>
          <div className='flex items-center justify-between'>
            <Image
              src='/singpass.svg'
              alt='Singpass Logo'
              width={170}
              height={170}
            />
            <Image src='/ecics.svg' alt='ECICS Logo' width={100} height={100} />
          </div>

          <div className='mt-6 text-lg font-bold'>
            Review your Myinfo details
          </div>

          {isMobile ? (
            <div>
              <div className='mt-4'>
                <div className='text-sm font-bold'>Email Address</div>
                <InputField name='email' />
              </div>
              <div className='mt-4'>
                <div className='text-sm font-bold'>Phone Number</div>
                <InputField name='phone' />
              </div>
              {commonInfo?.personal && (
                <InfoSection title='Personal Info' data={commonInfo.personal} />
              )}
              {commonInfo?.vehicle && commonInfo.vehicle.length > 0 && (
                <InfoSection
                  title='Vehicle Details'
                  data={commonInfo.vehicle}
                />
              )}
            </div>
          ) : (
            <div className='w-2/3 justify-self-center'>
              <div className='mt-6 flex items-center justify-between rounded-md border border-gray-300 bg-white p-4'>
                <div className='w-[calc(50%-10px)]'>
                  <div className='text-sm font-bold'>Email Address</div>
                  <InputField name='email' />
                </div>
                <div className='w-[calc(50%-10px)]'>
                  <div className='text-sm font-bold'>Phone Number</div>
                  <InputField name='phone' />
                </div>
              </div>
              {commonInfo?.personal && (
                <InfoSection
                  title='Personal Details'
                  data={commonInfo.personal}
                  boxClass='mt-4'
                />
              )}
              {commonInfo?.vehicle && commonInfo.vehicle.length > 0 && (
                <InfoSection
                  title='Vehicle Details'
                  data={commonInfo.vehicle}
                  boxClass='mt-4'
                />
              )}
            </div>
          )}
        </div>
        <div className='flex justify-center gap-4 border-t bg-white p-4'>
          <SecondaryButton onClick={handleCloseModal}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={handleContinue}
            className='rounded-md px-4 py-2 text-white'
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
    </FormProvider>
  );
};

export default ReviewInfoDetail;

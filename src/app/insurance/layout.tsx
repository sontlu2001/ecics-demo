'use client';
import { useState } from 'react';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import ProcessBar from '@/components/ProcessBar';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import BusinessPartnerBar from './components/BusinessPartnerBar';

const stepToRoute: Record<StepProcessBar, string> = {
  [StepProcessBar.POLICY_DETAILS]: ROUTES.INSURANCE.BASIC_DETAIL,
  [StepProcessBar.SELECT_PLAN]: ROUTES.INSURANCE.PLAN,
  [StepProcessBar.SELECT_ADD_ON]: ROUTES.INSURANCE.ADD_ON,
  [StepProcessBar.COMPLETE_PURCHASE]: ROUTES.INSURANCE.COMPLETE_PURCHASE,
};

function InsuranceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouterWithQuery();
  const { isMobile } = useDeviceDetection();
  const [currentStep, setCurrentStep] = useState(StepProcessBar.POLICY_DETAILS);
  const handleChangeStep = (step: StepProcessBar) => {
    if (step === currentStep) return;
    const path = stepToRoute[step];
    if (!path) return;
    setCurrentStep(step);
    router.push(path);
  };

  return (
    <>
      <div className='sticky top-0 z-10 w-full bg-white'>
        {isMobile && (
          <BusinessPartnerBar
            businessName='Business Partner Name'
            companyName='Leo Management Consultancy Pte Ltd'
          />
        )}
        <div className='flex w-full justify-between p-4 px-10 pb-0'>
          <SecondaryButton
            icon={<ArrowBackIcon size={11} />}
            className='hidden w-32 rounded-sm md:block'
          >
            Back
          </SecondaryButton>
          <div className='md:w-[520px]'>
            <ProcessBar currentStep={currentStep} onChange={handleChangeStep} />
          </div>
          <PrimaryButton className='hidden w-32 rounded-sm md:block'>
            Save
          </PrimaryButton>
        </div>
      </div>
      <div className='mx-auto w-full max-w-[1280px]'>{children}</div>
    </>
  );
}

export default InsuranceLayout;

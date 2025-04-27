'use client';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import ProcessBar from '@/components/ProcessBar';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { StepProcessBar } from '@/libs/enums/processBarEnums';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BusinessPartnerBar from './components/BusinessPartnerBar';

const mapStepToPath = {
  [StepProcessBar.POLICY_DETAILS]: 'basic-detail',
  [StepProcessBar.SELECT_PLAN]: 'plan',
  [StepProcessBar.SELECT_ADD_ON]: 'add-on',
  [StepProcessBar.COMPLETE_PURCHASE]: 'complete-purchase',
};

function InsuranceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isMobile } = useDeviceDetection();
  const [currentStep, setCurrentStep] = useState(StepProcessBar.POLICY_DETAILS);
  const handleChangeStep = (step: StepProcessBar) => {
    if (step === currentStep) return;
    const path = mapStepToPath[step];
    setCurrentStep(step);
    router.push(`/insurance/${path}`);
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

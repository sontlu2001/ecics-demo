'use client';
import { ProcessBarType } from '@/app/motor/insurance/InsuranceLayout';
import { StepProcessBar } from '@/libs/enums/processBarEnums';
import type { StepsProps } from 'antd';
import { Steps } from 'antd';
import { useSearchParams } from 'next/navigation';

interface ProcessBarProps {
  currentStep: ProcessBarType;
  onChange?: (current: number) => void;
  companyName?: string;
  isFinalized?: boolean;
}

const stepsData = [
  { step: StepProcessBar.POLICY_DETAILS, title: 'Policy Details' },
  { step: StepProcessBar.SELECT_PLAN, title: 'Select Plan' },
  { step: StepProcessBar.SELECT_ADD_ON, title: 'Select Add On' },
  { step: StepProcessBar.PERSONAL_DETAIL, title: 'Details' },
  { step: StepProcessBar.COMPLETE_PURCHASE, title: 'Complete Purchase' },
];

const stepsDataSingPass = [
  { step: StepProcessBar.POLICY_DETAILS, title: 'Policy Details' },
  { step: StepProcessBar.SELECT_PLAN, title: 'Select Plan' },
  { step: StepProcessBar.SELECT_ADD_ON, title: 'Select Add On' },
  { step: StepProcessBar.COMPLETE_PURCHASE, title: 'Complete Purchase' },
];

const getStepStatus = (step: StepProcessBar, currentStep: ProcessBarType) => {
  if (currentStep !== undefined && step < currentStep) return 'finish';
  if (step === currentStep) return 'process';
  return 'wait';
};

function splitText(text: string): [string, string] {
  const words = text.split(' ');
  if (words.length <= 1) {
    return [text, ''];
  }
  const firstWord = words[0];
  const remaining = words.slice(1).join(' ');
  return [firstWord, remaining];
}

export default function ProcessBar({
  currentStep,
  onChange,
  companyName,
  isFinalized,
}: ProcessBarProps) {
  const searchParams = useSearchParams();
  const isManual = searchParams.get('manual') === 'true';
  const selectedStepsData = isManual ? stepsData : stepsDataSingPass;

  const steps: StepsProps['items'] = selectedStepsData.map(
    ({ title, step }) => {
      const stepStatus = getStepStatus(step, currentStep);
      const [firstWord, remaining] = splitText(title);
      return {
        title: (
          <p className='inline-block text-xs leading-4'>
            <span className='block'>{firstWord}</span>
            <span className='block'>{remaining}</span>
          </p>
        ),
        status: stepStatus,
        disabled: stepStatus === 'wait' || isFinalized,
        icon:
          stepStatus === 'wait' ? (
            <div className='custom-step-wait'></div>
          ) : undefined,
      };
    },
  );
  return (
    <div className='w-full justify-center'>
      <Steps
        current={currentStep}
        onChange={onChange}
        labelPlacement='vertical'
        direction='horizontal'
        responsive={false}
        items={steps}
      />
      <p className='hidden pb-4 pt-2 text-center font-semibold md:block'>
        {companyName}
      </p>
    </div>
  );
}

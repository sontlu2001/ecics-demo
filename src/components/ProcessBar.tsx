'use client';
import { StepProcessBar } from '@/libs/enums/processBarEnums';
import type { StepsProps } from 'antd';
import { Steps } from 'antd';

interface ProcessBarProps {
  currentStep: StepProcessBar;
  onChange?: (current: number) => void;
}

const stepsData = [
  { step: StepProcessBar.POLICY_DETAILS, title: 'Policy Details' },
  { step: StepProcessBar.SELECT_PLAN, title: 'Select Plan' },
  { step: StepProcessBar.SELECT_ADD_ON, title: 'Select Add On' },
  { step: StepProcessBar.COMPLETE_PURCHASE, title: 'Complete Purchase' },
];

const getStepStatus = (step: StepProcessBar, currentStep: StepProcessBar) => {
  if (step < currentStep) return 'finish';
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

export default function ProcessBar({ currentStep, onChange }: ProcessBarProps) {
  const steps: StepsProps['items'] = stepsData.map(({ title, step }) => {
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
      // disabled: stepStatus === 'wait',
      icon:
        stepStatus === 'wait' ? (
          <div className='custom-step-wait'></div>
        ) : undefined,
    };
  });
  return (
    <Steps
      current={currentStep}
      onChange={onChange}
      labelPlacement='vertical'
      direction='horizontal'
      responsive={false}
      items={steps}
    />
  );
}

'use client';

import clsx from 'clsx';

import { formatCurrency } from '@/libs/utils/utils';

import CrossMarkIcon from '@/components/icons/CrossMark';
import PlanNormalIcon from '@/components/icons/PlanNormalIcon';
import PlanPremiumIcon from '@/components/icons/PlanPremiumIcon';
import TickCircleIcon from '@/components/icons/TickCircleIcon';
import { PrimaryButton } from '@/components/ui/buttons';

import { FormatPlan } from '../PlanDetail';

function PlanCardDesktop({
  plans,
  selectedPlan,
  setSelectedPlan,
  isSaving,
}: {
  plans: FormatPlan[] | undefined;
  selectedPlan: FormatPlan | null;
  setSelectedPlan: (plan: FormatPlan | null) => void;
  isSaving: boolean;
}) {
  return (
    <div className='flex w-full justify-evenly gap-6 lg:gap-5'>
      {plans?.map((plan, index) => {
        const isRecommended = plan.is_recommended;
        const activeFeatures = plan.benefits
          .filter((feature) => feature.is_active)
          .sort((a, b) => a.order - b.order);
        const inactiveFeatures = plan.benefits
          .filter((feature) => !feature.is_active)
          .sort((a, b) => a.order - b.order);
        const active = selectedPlan?.id === plan.id;

        return (
          <div
            key={index}
            className={clsx(
              'relative min-w-52 flex-1 rounded-2xl border-[1px] border-gray-100 bg-gray-100 px-2 py-6 shadow-md transition-all duration-500',
              {
                'bg-[url(/card-background.svg)] bg-cover bg-no-repeat': active,
                'border-sky-500': active,
              },
            )}
          >
            <div className='flex h-full flex-col justify-between px-4'>
              <div className=''>
                <div className='flex justify-between py-3 pt-2'>
                  {isRecommended ? <PlanPremiumIcon /> : <PlanNormalIcon />}

                  {isRecommended && (
                    <div className='rounded-md bg-white px-2 py-1 text-xs text-sky-500'>
                      <span>Recommended</span>
                    </div>
                  )}
                </div>
                <p
                  className={clsx('text-lg font-semibold text-[#1B223C]', {
                    '!font-normal': active,
                  })}
                >
                  {plan.title}
                </p>
                {!!plan.subtitle && (
                  <p className='text-sm font-light text-gray-400'>
                    {plan.subtitle}
                  </p>
                )}
                <div className='max-w-80 pt-3'>
                  <p className='text-lg font-bold text-[#1B223C]'>
                    {formatCurrency(plan.premium_with_gst)}
                  </p>
                  {!!plan.discount && (
                    <div className='mt-1'>
                      <p className='text-md font-normal text-[#FF0004] line-through decoration-1'>
                        {formatCurrency(plan.currentPrice)}
                      </p>
                      <p className='text-xs font-light text-[#797878]'>
                        ({plan.discount}% off applied)
                      </p>
                    </div>
                  )}
                </div>
                {activeFeatures.map((feature, index) => (
                  <div
                    className='mt-2 flex items-start gap-2 text-sm'
                    key={index}
                  >
                    <TickCircleIcon size={12} className='mt-[6px]' />
                    <div dangerouslySetInnerHTML={{ __html: feature.name }} />
                  </div>
                ))}
                {inactiveFeatures.map((feature, index) => (
                  <div className='mt-2 flex items-start' key={index}>
                    <CrossMarkIcon
                      size={20}
                      className='mt-[6px] text-sky-700'
                    />
                    <div
                      className='text-[#B4B4B4]'
                      dangerouslySetInnerHTML={{ __html: feature.name }}
                    />
                  </div>
                ))}
              </div>
              <PrimaryButton
                className={clsx(
                  'mt-4 w-full py-2 transition-colors duration-500',
                  {
                    'bg-black hover:opacity-80': active,
                  },
                )}
                onClick={() => setSelectedPlan(plan)}
                disabled={isSaving}
              >
                Select
              </PrimaryButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PlanCardDesktop;

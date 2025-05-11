'use client';
import CrossMarkIcon from '@/components/icons/CrossMark';
import PlanNormalIcon from '@/components/icons/PlanNormalIcon';
import PlanPremiumIcon from '@/components/icons/PlanPremiumIcon';
import TickCircleIcon from '@/components/icons/TickCircleIcon';
import { PrimaryButton } from '@/components/ui/buttons';
import clsx from 'clsx';
import { useState } from 'react';
import { FormatPlan } from '../page';

function PlanCardDesktop({
  plans,
  selectedPlan,
  setSelectedPlan,
}: {
  plans: FormatPlan[] | undefined;
  selectedPlan: FormatPlan | null;
  setSelectedPlan: (plan: FormatPlan | null) => void;
}) {
  return (
    <div className='flex  w-full justify-center gap-6 lg:gap-10'>
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
              'relative h-[620px] rounded-2xl border-[1px] border-gray-100 bg-white px-4 py-6 shadow-md transition-all duration-500',
              {
                'bg-[url(/card-background.svg)] bg-cover bg-no-repeat': active,
                'border-sky-500': active,
              },
            )}
          >
            <div className='flex h-full flex-col justify-between px-4'>
              <div className='relative z-10'>
                <div className='flex justify-between py-6 pt-2'>
                  {isRecommended ? <PlanPremiumIcon /> : <PlanNormalIcon />}

                  {isRecommended && (
                    <div className='rounded-md bg-white px-2 py-1 text-xs text-sky-500'>
                      <span> Best Offer</span>
                    </div>
                  )}
                </div>
                <p className='text-2xl font-semibold'>{plan.title}</p>
                {!!plan.subtitle && (
                  <p className='text-sm font-light text-gray-400'>
                    {plan.subtitle}
                  </p>
                )}
                <div className='flex max-w-80 items-center justify-between pb-5 pt-3'>
                  <p className='text-xl font-extrabold'>
                    S$ {plan.premium_with_gst.toFixed(2)}
                  </p>
                  {!!plan.discount && (
                    <>
                      <p className='text-lg text-sky-500 line-through decoration-1'>
                        S$ {plan.currentPrice.toFixed(2)}
                      </p>
                      <p className='text-xs text-gray-400'>{`(${plan.discount}% off applied)`}</p>
                    </>
                  )}
                </div>
                {activeFeatures.map((feature, index) => (
                  <div className='mt-4 flex items-start gap-4' key={index}>
                    <TickCircleIcon size={12} className='mt-[6px]' />
                    <div dangerouslySetInnerHTML={{ __html: feature.name }} />
                  </div>
                ))}
                {inactiveFeatures.map((feature, index) => (
                  <div className='mt-4 flex items-start gap-4' key={index}>
                    <CrossMarkIcon
                      size={20}
                      className='mt-[6px] text-sky-700'
                    />
                    <div dangerouslySetInnerHTML={{ __html: feature.name }} />
                  </div>
                ))}
              </div>
              <PrimaryButton
                className={clsx('w-full py-2 transition-colors duration-500', {
                  'bg-black hover:opacity-80': active,
                })}
                onClick={() => setSelectedPlan(plan)}
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

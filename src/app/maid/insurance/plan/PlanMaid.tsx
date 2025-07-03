'use client';

import clsx from 'clsx';

import { formatCurrency } from '@/libs/utils/utils';

import TickCircleIcon from '@/components/icons/TickCircleIcon';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

import { FormatPlan } from './PlanDetail';

function PlanMaid({
  plans,
  selectedPlan,
  setSelectedPlan,
  isSaving,
}: {
  plans: FormatPlan[];
  selectedPlan: FormatPlan | null;
  setSelectedPlan: (plan: FormatPlan | null) => void;
  isSaving: boolean;
}) {
  const { isMobile } = useDeviceDetection();
  return (
    <div
      className={`flex gap-4 ${isMobile ? 'flex-col pb-28' : 'flex-row pb-10'}`}
    >
      {plans
        .slice()
        .sort((a: any, b: any) => {
          if (isMobile) {
            if (a.is_recommended && !b.is_recommended) return -1;
            if (!a.is_recommended && b.is_recommended) return 1;
          }
          return a.order - b.order;
        })
        .map((plan, index) => {
          const isRecommended = plan.is_recommended;
          const active = selectedPlan?.id === plan.id;

          return (
            <div
              className={clsx(
                'relative mt-3 border p-6 shadow-md',
                isMobile
                  ? ''
                  : 'flex min-h-[400px] flex-1 flex-col justify-between',
                active
                  ? 'border-[2px] border-[#00ADEF]'
                  : 'border-[#F0F0F0] bg-white',
              )}
              key={index}
              onClick={!isSaving ? () => setSelectedPlan(plan) : undefined}
            >
              {isRecommended && (
                <div className='absolute -top-4 left-4 rounded-full bg-[#FF9500] px-3 py-1'>
                  <span className='text-white'>Most Popular</span>
                </div>
              )}
              <div className='text-lg font-bold text-[#080808]'>
                {plan.title}
              </div>
              {plan.benefits.map((benefit: any, index) => (
                <div className='mt-4 flex items-start gap-2' key={index}>
                  <TickCircleIcon
                    size={12}
                    className='mt-[6px] text-green-600'
                  />
                  <div className='text-[#1E1E1E]'>{benefit}</div>
                </div>
              ))}
              <div className='relative z-0 mt-6 overflow-hidden rounded-xl bg-review-blue'>
                <div className='pointer-events-none absolute inset-0 z-0 rounded-xl border border-[#00ADEFCC]' />
                <div
                  className={clsx(
                    'absolute -left-3 top-1/2 h-[1rem] w-5 -translate-y-1/2 rounded-md border border-secondaryBlue bg-white',
                  )}
                />
                <div
                  className={clsx(
                    'absolute -right-3 top-1/2 h-[1rem] w-5 -translate-y-1/2 rounded-md border border-secondaryBlue bg-white',
                  )}
                />
                {plan.discount ? (
                  <>
                    <div className='flex items-center p-4 pb-2'>
                      <div className='text-center text-base font-semibold text-black'>
                        {formatCurrency(plan.premium_with_gst)}
                      </div>
                      <div className='ml-1 text-center text-sm font-semibold text-[#FD1212] line-through decoration-1'>
                        {formatCurrency(plan.currentPrice)}
                      </div>
                    </div>
                    <div className='mx-4 border-t border-dashed border-[#888888]' />
                    <div className='p-4 pt-[10px]'>
                      <div className='text-xs font-semibold text-[#333333]'>
                        <span className='font-bold'>{plan.promoCode}</span>{' '}
                        applied({plan.discount}% OFF)
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='flex h-12 items-center ps-6 text-base font-semibold leading-[27px]'>
                    {formatCurrency(plan.premium_with_gst)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default PlanMaid;

'use client';
import CrossMarkIcon from '@/components/icons/CrossMark';
import TickCircleIcon from '@/components/icons/TickCircleIcon';
import { Plan } from '@/libs/types/quote';
import clsx from 'clsx';

function PlanCardMobile({
  active = false,
  plan,
  onClick,
}: {
  active?: boolean;
  plan: Plan;
  onClick?: () => void;
}) {
  const isRecommended = plan.is_recommended;
  const activeFeatures = plan.benefits.filter((feature) => feature.is_active);
  const inactiveFeatures = plan.benefits.filter(
    (feature) => !feature.is_active,
  );
  return (
    <div
      className={clsx(
        'relative mt-3 rounded-md border p-6 shadow-md',
        active
          ? 'border-plan-blue bg-plan-blue'
          : 'border-secondaryBlue bg-white',
      )}
    >
      {isRecommended && (
        <div className='absolute -top-3 right-4 rounded-full bg-sky-500 px-3 py-1'>
          <span className='text-white'>Recommended</span>
        </div>
      )}
      <div className='text-lg font-bold'>Comprehensive Plan</div>
      {activeFeatures.map((feature, index) => (
        <div className='mt-4 flex items-start gap-2' key={index}>
          <TickCircleIcon size={12} className='mt-[6px]' />
          <div dangerouslySetInnerHTML={{ __html: feature.name }} />
        </div>
      ))}
      {inactiveFeatures.map((feature, index) => (
        <div className='mt-4 flex items-start' key={index}>
          <CrossMarkIcon size={12} className='mt-[6px]' />
          <div dangerouslySetInnerHTML={{ __html: feature.name }} />
        </div>
      ))}
      <div className='relative mt-6'>
        <div className='relative z-0 overflow-hidden rounded-xl bg-review-blue'>
          <div className='pointer-events-none absolute inset-0 z-0 rounded-xl border border-secondaryBlue' />
          <div
            className={clsx(
              'absolute -left-3 top-1/2 h-[1rem] w-5 -translate-y-1/2 rounded-md border border-secondaryBlue',
              active ? 'bg-plan-blue' : 'bg-white',
            )}
          />
          <div
            className={clsx(
              'absolute -right-3 top-1/2 h-[1rem] w-5 -translate-y-1/2 rounded-md border border-secondaryBlue',
              active ? 'bg-plan-blue' : 'bg-white',
            )}
          />
          <div className='flex items-center p-4 pb-2'>
            <div className='text-center text-base font-semibold text-black'>
              $S {plan.premium_with_gst}
            </div>
            <div className='ml-1 text-center text-sm font-medium text-[#FD1212] line-through decoration-1'>
              $S {plan.premium_bef_gst}
            </div>
          </div>
          <div className='mx-4 border-t border-dashed border-secondaryBlue' />
          <div className='p-4 pt-[10px]'>
            <div className='text-sm font-semibold text-black'>
              CAR (15% off applied)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanCardMobile;

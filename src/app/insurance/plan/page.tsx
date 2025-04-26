'use client';

import { PrimaryButton } from '@/components/ui/buttons';
import { useLayoutEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SelfDeclarationConfirmModal from './components/SelfDeclarationConfirmModal';
import PlanCardMobile, { DataPlanCard } from './components/PlanCardMobile';
import PlanCardDesktop from './components/PlanCardDesktop';
const plans: DataPlanCard[] = [
  {
    title: 'Third Party & Theft',
    subtitle: 'Essential Coverage for Everyday Driving',
    activeFeatures: [
      'Third-Party liability coverage relating to vehicle charging',
      'Free NCD Protector (from 10%) & Waiver of Excess',
      'Up to $50,000 complimentary Personal Accident coverage',
      'Complete Vehicle Coverage',
      'Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models',
    ],
    inactiveFeatures: [],
    price: '2700',
    discountedPrice: '3200',
    discount: '15',
    recommended: true,
  },
  {
    title: 'Comprehensive Plan',
    subtitle: 'Comprehensive Coverage for Peace of Mind',
    activeFeatures: [
      'Third-Party liability coverage relating to vehicle charging',
      'Free NCD Protector (from 10%) & Waiver of Excess',
      'Up to $50,000 complimentary Personal Accident coverage',
    ],
    inactiveFeatures: [
      'Complete Vehicle Coverage',
      'Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models',
    ],
    price: '2700',
    discountedPrice: '3200',
    discount: '15',
    recommended: false,
  },
  {
    title: 'Comprehensive Plan 2',
    subtitle: 'Comprehensive Coverage for Peace of Mind',
    activeFeatures: [
      'Third-Party liability coverage relating to vehicle charging',
      'Free NCD Protector (from 10%) & Waiver of Excess',
      'Up to $50,000 complimentary Personal Accident coverage',
    ],
    inactiveFeatures: [
      'Complete Vehicle Coverage',
      'Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models',
    ],
    price: '2700',
    discountedPrice: '3200',
    discount: '15',
    recommended: false,
  },
];

function PlanPage() {
  const [screenWidth, setScreenWith] = useState(0);
  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  useLayoutEffect(() => {
    if (!window?.innerWidth) return;
    setScreenWith(window?.innerWidth - 32);
  }, []);

  return (
    <div className='flex w-full flex-col justify-center'>
      {/* UI for Mobile */}
      <div
        className='mx-4 md:hidden'
        // When using Next.js (SSR), Swiper may throw a "createContext" error due to server-side rendering issues.
        // This can lead to incorrect width calculations for the Swiper component.
        // To address this, we recalculate the width dynamically on the client side.
        style={{
          width: screenWidth,
        }}
      >
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation
          modules={[Navigation]}
        >
          {plans.map((plan, index) => (
            <SwiperSlide key={index}>
              <PlanCardMobile
                isRecommended={plan.recommended}
                data={plan}
                active={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* UI for Desktop */}
      <div className='hidden md:block '>
        <PlanCardDesktop plans={plans} />
      </div>

      <div className='fixed bottom-0 z-10 mt-4 w-full md:bottom-14 md:max-w-[600px] md:border-none  md:shadow-none'>
        <div className='flex w-full justify-between border-t-2 bg-white p-4 py-2 shadow-md shadow-gray-500  md:py-4'>
          <div className='md:flex md:items-center md:gap-4'>
            <p>
              <span className='text-lg font-semibold md:text-3xl'>S$ 2700</span>{' '}
              <span className='text-lg font-semibold text-red-500 md:text-2xl'>
                $3200
              </span>
            </p>
            <p className='font-semibold'>(inclusive of GST)</p>
          </div>
          <PrimaryButton
            onClick={() => setShowConfirmDeclaration(true)}
            className='md:w-40'
          >
            Continue
          </PrimaryButton>
        </div>
      </div>

      <SelfDeclarationConfirmModal
        visible={showConfirmDeclaration}
        onOk={() => setShowConfirmDeclaration(false)}
      />
    </div>
  );
}

export default PlanPage;

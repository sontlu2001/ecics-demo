'use client';

import { PrimaryButton } from '@/components/ui/buttons';
import { useCreateQuote, useGetQuote } from '@/hook/insurance/quote';
import { useEffect, useLayoutEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import PlanCardDesktop from './components/PlanCardDesktop';
import PlanCardMobile from './components/PlanCardMobile';
import SelfDeclarationConfirmModal from './components/SelfDeclarationConfirmModal';

function PlanPage() {
  const [screenWidth, setScreenWith] = useState(0);
  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  // using this to really get the quote data from the API
  // const { data, isLoading } = useGetQuote('9dbb6b4e00432677');

  // using for testing purpose
  const { mutate: createQuote, data, isSuccess } = useCreateQuote();
  useEffect(() => {
    const payload = {
      key: 'bd6e8c8259ee4196',
      partner_code: 'A0000165',
      promo_code: 'ECICS5',
      company_id: 2,
      personal_info: {
        name: 'Sayan',
        gender: 'Male',
        maritalStatus: 'Single',
        date_of_birth: '08/04/2000',
        nric: 'S6020900F',
        address: '10 Eunos Road Singapore 4324',
        driving_experience: 2,
        phone_number: '98989898',
        email: 'test321@gmail.com',
      },
      vehicle_basic_details: {
        make: 'Audi',
        model: 'A1 1.0',
        first_registered_year: '2024',
        chasis_number: 'SBA123A',
      },
      insurance_additional_info: {
        no_claim_discount: 10,
        no_of_claim: 0,
        start_date: '28/04/2025',
        end_date: '27/04/2026',
      },
    };
    createQuote(payload);
  }, []);

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
          {data?.plans.map((plan, index) => (
            <SwiperSlide key={index}>
              <PlanCardMobile plan={plan} active={index === 0} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* UI for Desktop */}
      <div className='hidden pt-4 md:block'>
        <PlanCardDesktop plans={data?.plans} />
      </div>
      <div className='fixed bottom-0 left-1/2 z-10 mt-4 w-full -translate-x-1/2 transform shadow-sm shadow-gray-300 md:bottom-14  md:max-w-[600px] md:rounded-md md:border-none'>
        <div className='flex w-full justify-between border-t-2 bg-white p-4 py-2 md:border-none md:py-4'>
          <div className='md:flex md:items-center md:gap-4'>
            <p>
              <span className='text-lg font-semibold md:text-3xl'>S$ 2700</span>{' '}
              <span className='text-lg font-semibold text-red-500 md:text-2xl'>
                $3200
              </span>
            </p>
            <p className='font-semibold'>(15 inclusive of GST)</p>
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

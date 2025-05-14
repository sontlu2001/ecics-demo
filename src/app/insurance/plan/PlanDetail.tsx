'use client';

import { Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Plan } from '@/libs/types/quote';
import { PrimaryButton } from '@/components/ui/buttons';
import { ROUTES } from '@/constants/routes';
import { useGetQuote, useSaveQuote } from '@/hook/insurance/quote';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import PlanCardDesktop from './components/PlanCardDesktop';
import PlanCardMobile from './components/PlanCardMobile';
import SelfDeclarationConfirmModal from './components/SelfDeclarationConfirmModal';
import HeaderVehicleInfo from './components/HeaderVehicleInfo';
import HeaderVehicleInfoMobile from './components/HeaderVehicleInfoMobile';
import { current } from '@reduxjs/toolkit';
import { UserStep } from '@/libs/enums/processBarEnums';

export interface FormatPlan extends Plan {
  discount: number;
  currentPrice: number;
}
function PlanDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';

  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FormatPlan | null>(null);
  const { data: quoteInfo, isLoading } = useGetQuote(key);
  const {
    mutateAsync: saveQuote,
    isPending: isSaving,
    isSuccess,
  } = useSaveQuote();

  const plans = quoteInfo?.data?.plans ?? [];

  useEffect(() => {
    onSaveRegister(() => {
      const data = {
        ...quoteInfo?.data,
        current_step: UserStep.SELECT_PLAN,
        selected_plan: selectedPlan?.title,
        key: key,
      };
      return data;
    });
  }, [selectedPlan]);

  const plansFormatted: FormatPlan[] = plans.map((plan) => ({
    ...plan,
    discount: quoteInfo?.promo_code?.discount ?? 0,
    currentPrice:
      plan.premium_with_gst /
      (1 - (quoteInfo?.promo_code?.discount ?? 0) / 100),
  }));

  useEffect(() => {
    if (!plansFormatted.length) return;
    if (quoteInfo?.data?.selected_plan) {
      const selectedPlan = plansFormatted.find(
        (plan) => plan.title === quoteInfo?.data?.selected_plan,
      );
      if (selectedPlan) {
        setSelectedPlan(selectedPlan);
        return;
      }
    }
    const recommendedPlan = plansFormatted.find((plan) => plan.is_recommended);
    if (recommendedPlan) {
      setSelectedPlan(recommendedPlan);
      return;
    }
  }, [plans]);

  const choicePlan = (plan: FormatPlan | null) => {
    const data = {
      ...quoteInfo?.data,
      selected_plan: plan?.title,
      key: key,
    };
    saveQuote({ key, data, is_sending_email: false }).then((res) => {
      router.push(ROUTES.INSURANCE.ADD_ON);
    });
    setShowConfirmDeclaration(false);
  };

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col justify-center'>
      <div className='py-4 md:hidden'>
        <HeaderVehicleInfoMobile
          vehicleInfo={quoteInfo?.data.vehicle_info_selected}
        />
      </div>
      <div className='flex flex-col items-center justify-center'>
        <div className='max-w-[1280px]'>
          <div className='hidden items-center justify-between md:flex md:flex-col md:gap-4'>
            <HeaderVehicleInfo
              vehicleInfo={quoteInfo?.data.vehicle_info_selected}
              insuranceAdditionalInfo={
                quoteInfo?.data.insurance_additional_info
              }
            />
          </div>
          {/* UI for Mobile */}
          <div className='mx-4 pb-20 md:hidden'>
            <PlanCardMobile
              plans={plansFormatted}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          </div>

          {/* UI for Desktop */}
          <div className='hidden pt-4 md:block '>
            <PlanCardDesktop
              plans={plansFormatted}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          </div>
        </div>
      </div>

      <div className='mt-4 w-full border !border-[#F7F7F9] bg-[#FFFEFF] shadow-md md:flex md:flex-row md:justify-center'>
        <div className='fixed bottom-0 left-1/2 z-10 w-full -translate-x-1/2 transform shadow-gray-300 md:static md:bottom-auto md:left-0 md:z-auto md:max-w-[800px] md:translate-x-0 md:rounded-md md:border-none'>
          <div className='flex w-full justify-between border-t-2 bg-white p-4 py-2 md:border-none md:py-4 '>
            <div className='gap-2 md:flex md:items-center md:gap-4'>
              <p>
                <span className='text-lg font-semibold text-[#323743] md:text-3xl md:font-bold md:text-[#1B223C]'>
                  S$ {selectedPlan?.premium_with_gst.toFixed(2)}
                </span>
                {!!selectedPlan?.discount && (
                  <span className='ps-4 text-lg font-normal text-[#FF0004] line-through decoration-1 md:text-2xl md:text-[#EF0000]'>
                    $ {selectedPlan?.currentPrice.toFixed(2)}
                  </span>
                )}
              </p>
              <p className='font-semibold text-[#323743]'>(inclusive of GST)</p>
            </div>
            <PrimaryButton
              onClick={() => setShowConfirmDeclaration(true)}
              className='md:w-40'
              disabled={!selectedPlan?.id}
              loading={isSaving}
            >
              Continue
            </PrimaryButton>
          </div>
        </div>
      </div>

      <SelfDeclarationConfirmModal
        visible={showConfirmDeclaration}
        onOk={() => choicePlan(selectedPlan)}
        onCancel={() => setShowConfirmDeclaration(false)}
      />
    </div>
  );
}

export default PlanDetail;

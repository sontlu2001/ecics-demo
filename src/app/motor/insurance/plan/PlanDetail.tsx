'use client';

// import HeaderVehicleInfo from './components/HeaderVehicleInfo';
// import HeaderVehicleInfoMobile from './components/HeaderVehicleInfoMobile';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';

import { UserStep } from '@/libs/enums/processBarEnums';
import { Plan } from '@/libs/types/quote';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import { PricingSummary } from '@/components/page/FeeBar';

import { ROUTES } from '@/constants/routes';
import { useSaveQuote } from '@/hook/insurance/quote';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import PlanCardMobile from './components/PlanCardMobile';
import SelfDeclarationConfirmModal from './components/SelfDeclarationConfirmModal';
import { ProductType } from '../basic-detail/options';

export interface FormatPlan extends Plan {
  discount: number;
  currentPrice: number;
  promoCode: string;
}

function PlanDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const { handleBack } = useInsurance();

  const dispatch = useAppDispatch();
  const key = searchParams.get('key') || '';
  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FormatPlan | null>(null);

  const quoteInfo = useAppSelector((state) => state.quote?.quote);
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
    promoCode: quoteInfo?.promo_code?.code ?? '',
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
      if (res) {
        dispatch(updateQuote(res));
      }
      router.push(ROUTES.INSURANCE.ADD_ON);
    });
    setShowConfirmDeclaration(false);
  };

  return (
    <div className='flex w-full flex-col justify-center md:mb-16'>
      {/* hidden for now */}
      {/* <div className='py-4 md:hidden'>
                <HeaderVehicleInfoMobile
                  vehicleInfo={quoteInfo?.data.vehicle_info_selected}
                />
              </div> */}
      <div className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-[1280px]'>
          <div className='mx-4 pb-4 text-[16px] font-bold underline'>
            Select a plan
          </div>
          {/* hidden for now */}
          {/* <div className='hidden items-center justify-between md:flex md:flex-col md:gap-4'>
                        <HeaderVehicleInfo
                          vehicleInfo={quoteInfo?.data.vehicle_info_selected}
                          insuranceAdditionalInfo={
                            quoteInfo?.data.insurance_additional_info
                          }
                        />
                      </div> */}
          {/* UI for Mobile and Desktop (updated*/}
          <div className='mx-4'>
            <PlanCardMobile
              plans={plansFormatted}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
      <PricingSummary
        isBasicDetailScreen={false}
        planFee={selectedPlan?.premium_with_gst ?? 0}
        addonFee={0}
        discount={selectedPlan?.discount ?? 0}
        title={`${selectedPlan?.title}`}
        textButton='Next'
        onClick={() => setShowConfirmDeclaration(true)}
        handleBack={handleBack}
        productType={ProductType.CAR}
        loading={isSaving}
        titlePlan={selectedPlan?.title}
        isPlan
      />

      <SelfDeclarationConfirmModal
        visible={showConfirmDeclaration}
        onOk={() => choicePlan(selectedPlan)}
        onCancel={() => setShowConfirmDeclaration(false)}
        product_type={ProductType.CAR}
      />
    </div>
  );
}

export default PlanDetail;

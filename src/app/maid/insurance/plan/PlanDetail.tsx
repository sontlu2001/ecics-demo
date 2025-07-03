'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { UserStep } from '@/libs/enums/processBarEnums';
import { Plan } from '@/libs/types/quote';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import { PricingSummary } from '@/components/page/FeeBar';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ROUTES } from '@/constants/routes';
import { useSaveMaidQuote } from '@/hook/insurance/maidQuote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateMaidQuote } from '@/redux/slices/maidQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import PlanMaid from './PlanMaid';

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
  const { isMobile } = useDeviceDetection();
  const [selectedPlan, setSelectedPlan] = useState<FormatPlan | null>(null);

  const maidQuoteInfo = useAppSelector((state) => state.maidQuote?.maidQuote);
  const {
    mutateAsync: saveMaidQuote,
    isPending: isSaving,
    isSuccess,
  } = useSaveMaidQuote();

  const plans = maidQuoteInfo?.data?.plans ?? [];

  useEffect(() => {
    onSaveRegister(() => {
      const data = {
        ...maidQuoteInfo?.data,
        current_step: UserStep.SELECT_PLAN,
        selected_plan: selectedPlan?.title,
        key: key,
      };
      return data;
    });
  }, [selectedPlan]);

  const plansFormatted: FormatPlan[] = plans.map((plan) => ({
    ...plan,
    discount: maidQuoteInfo?.promo_code?.discount ?? 0,
    currentPrice:
      plan.premium_with_gst /
      (1 - (maidQuoteInfo?.promo_code?.discount ?? 0) / 100),
    promoCode: maidQuoteInfo?.promo_code?.code ?? '',
  }));

  useEffect(() => {
    if (!plansFormatted.length) return;
    if (maidQuoteInfo?.data?.selected_plan) {
      const selectedPlan = plansFormatted.find(
        (plan) => plan.title === maidQuoteInfo?.data?.selected_plan,
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
      ...maidQuoteInfo?.data,
      selected_plan: plan?.title,
      key: key,
    };
    saveMaidQuote({ key, data, is_sending_email: false }).then((res) => {
      if (res) {
        dispatch(updateMaidQuote(res));
      }
      router.push(ROUTES.INSURANCE_MAID.ADD_ON);
    });
  };

  return (
    <div className='flex w-full flex-col justify-center md:mb-16'>
      <div className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-[1280px]'>
          <div className='mx-4 pb-4 text-[16px] font-bold underline'>
            Select a plan
          </div>
          <div className='mx-4'>
            <PlanMaid
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
        onClick={() => choicePlan(selectedPlan)}
        handleBack={handleBack}
        productType={ProductType.MAID}
        loading={isSaving}
        titlePlan={selectedPlan?.title}
        isPlan
      />
    </div>
  );
}

export default PlanDetail;

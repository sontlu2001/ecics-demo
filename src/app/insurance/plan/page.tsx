'use client';

import { PrimaryButton } from '@/components/ui/buttons';
import {
  useGenerateQuote,
  useGetQuote,
  useSaveQuote,
} from '@/hook/insurance/quote';
import { Plan } from '@/libs/types/quote';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import PlanCardDesktop from './components/PlanCardDesktop';
import PlanCardMobile from './components/PlanCardMobile';
import SelfDeclarationConfirmModal from './components/SelfDeclarationConfirmModal';
import { Spin } from 'antd';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { ROUTES } from '@/constants/routes';
export interface FormatPlan extends Plan {
  discount: number;
  currentPrice: number;
}
function PlanPage() {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';

  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FormatPlan | null>(null);
  const { data: quoteInfo, isLoading } = useGetQuote(key);
  const { mutate: saveQuote, isPending: isSaving, isSuccess } = useSaveQuote();
  const plans = quoteInfo?.data?.plans ?? [];
  useEffect(() => {
    if (isSuccess) {
      router.push(ROUTES.INSURANCE.ADD_ON);
    }
  }, [isSuccess]);

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
    saveQuote({ key, data });
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
      {/* UI for Mobile */}
      <div className='mx-4 pb-20 md:hidden'>
        <PlanCardMobile
          plans={plansFormatted}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
      </div>

      {/* UI for Desktop */}
      <div className='hidden pt-4 md:block'>
        <PlanCardDesktop
          plans={plansFormatted}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
      </div>
      <div className='fixed bottom-0 left-1/2 z-10 mt-4 w-full -translate-x-1/2 transform shadow-sm shadow-gray-300 md:bottom-14  md:max-w-[800px] md:rounded-md md:border-none'>
        <div className='flex w-full justify-between border-t-2 bg-white p-4 py-2 md:border-none md:py-4'>
          <div className='md:flex md:items-center md:gap-4'>
            <p>
              <span className='text-lg font-semibold md:text-3xl'>
                S$ {selectedPlan?.premium_with_gst.toFixed(2)}
              </span>{' '}
              <span className='ps-4 text-lg font-semibold text-red-500 md:text-2xl'>
                $ {selectedPlan?.currentPrice.toFixed(2)}
              </span>
            </p>
            <p className='font-semibold'>
              ({selectedPlan?.discount} inclusive of GST)
            </p>
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

      <SelfDeclarationConfirmModal
        visible={showConfirmDeclaration}
        onOk={() => choicePlan(selectedPlan)}
      />
    </div>
  );
}

export default PlanPage;

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import { InsuranceLayoutContext } from '@/components/contexts/InsuranceLayoutContext';
import ModalImportant from '@/components/page/insurance/complete-purchase/ModalImportant';
import ProcessBar from '@/components/ProcessBar';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ECICS_URL } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { useVerifyPartnerCode } from '@/hook/insurance/common';
import { useSaveQuote } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import NavigationConfirmModal from '@/providers/modal/NavigationConfirmModal';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

export type ProcessBarType = StepProcessBar | undefined;

interface InsuranceLayoutProps {
  children:
    | ReactNode
    | ((props: { onSave: (fn: () => any) => void }) => ReactNode);
  stepToRoute: Record<StepProcessBar, string>;
  headerTitle: string;
  redirectToLoginPath?: string;
  productType: ProductType;
}

function InsuranceLayout({
  children,
  stepToRoute,
  headerTitle,
  productType,
  redirectToLoginPath,
}: InsuranceLayoutProps) {
  const router = useRouterWithQuery();
  const pathName = usePathname();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const { isMobile } = useDeviceDetection();
  const partner_code = params.get('partner_code') || '';
  const childSaveRef = useRef<() => any>(() => null);
  const [currentStep, setCurrentStep] = useState<ProcessBarType>(undefined);
  const { mutateAsync: saveQuote } = useSaveQuote();
  const [isShowPopupImportant, setIsShowPopupImportant] = useState(false);
  const [isShowPopupSingPass, setIsShowPopupSingPass] = useState(false);

  const isMaid = productType === ProductType.MAID;
  const isFinalized = useAppSelector((state) =>
    isMaid
      ? state.maidQuote?.maidQuote?.is_finalized
      : state.quote.quote?.is_finalized,
  );
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  const stepsData = [
    { step: StepProcessBar.POLICY_DETAILS, title: 'Basic Information' },
    { step: StepProcessBar.SELECT_PLAN, title: 'Select Plan' },
    { step: StepProcessBar.SELECT_ADD_ON, title: 'Add-ons' },
    {
      step: StepProcessBar.PERSONAL_DETAIL,
      title: productType === ProductType.MAID ? 'Helper’s Details' : 'Details',
    },
    { step: StepProcessBar.COMPLETE_PURCHASE, title: 'Summary' },
  ];

  const stepsDataSingPass = [
    { step: StepProcessBar.FIRST, title: '' },
    {
      step: StepProcessBar.POLICY_DETAILS,
      title:
        productType === ProductType.MAID
          ? 'Helper’s Information'
          : 'Policy Details',
    },
    { step: StepProcessBar.SELECT_PLAN, title: 'Select Plan' },
    { step: StepProcessBar.SELECT_ADD_ON, title: 'Add-ons' },
    { step: StepProcessBar.COMPLETE_PURCHASE, title: 'Summary' },
  ];

  const isLoadingStep = useAppSelector((state) => state.general.isLoadingStep);
  const { data: partnerInfo } = useVerifyPartnerCode(partner_code);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const getStepFromRoute = (route: string): ProcessBarType => {
    const entry = Object.entries(stepToRoute).find(
      ([_, value]) => value === route,
    );
    return entry ? (entry[0] as unknown as StepProcessBar) : undefined;
  };

  useLayoutEffect(() => {
    const currentStep = getStepFromRoute(pathName);
    if (currentStep) {
      setCurrentStep(+currentStep as StepProcessBar);
    }
  }, [pathName]);

  const handleChangeStep = (step: StepProcessBar) => {
    if (step === currentStep) return;
    if (step === StepProcessBar.POLICY_DETAILS) {
      setIsShowPopupImportant(true);
      return;
    }
    if (step === StepProcessBar.FIRST) {
      setIsShowPopupSingPass(true);
      return;
    }
    const path = stepToRoute[step];
    if (!path) return;
    setCurrentStep(step);
    router.push(path);
  };

  const handleBack = () => {
    if (currentStep === undefined) return;

    if (currentStep === StepProcessBar.SELECT_PLAN || isFinalized) {
      setIsShowPopupImportant(true);
      return;
    }

    if (currentStep === StepProcessBar.POLICY_DETAILS && redirectToLoginPath) {
      router.push(redirectToLoginPath, { preserveQuery: false });
      return;
    }
    const selectedStepsData = isSingPassFlow ? stepsDataSingPass : stepsData;

    const currentIndex = selectedStepsData.findIndex(
      (item: any) => item.step === currentStep,
    );

    const previousStep = selectedStepsData[currentIndex - 1]?.step;

    if (previousStep !== undefined) {
      const previousRouter = stepToRoute[previousStep];
      router.push(previousRouter);
    }
  };

  const handleSave = () => {
    const childData = childSaveRef.current();
    const { key, ...data } = childData;
    if (!key) return;
    saveQuote({
      key,
      data,
      is_sending_email: true,
    }).then((res) => {
      dispatch(updateQuote(res));
    });
  };

  const handleLogoClick = () => {
    setIsConfirmModalVisible(true);
  };

  const handleModalStay = () => {
    setIsConfirmModalVisible(false);
  };

  const handleModalLeave = () => {
    setIsConfirmModalVisible(false);
    window.location.href = ECICS_URL;
  };

  return (
    <InsuranceLayoutContext.Provider value={{ handleBack }}>
      <>
        <div className='relative z-10 w-full border-b-2 border-gray-300 shadow-md'>
          <div
            className={`mx-auto flex w-full items-center p-4 lg:max-w-[1280px] ${isMobile ? 'justify-center' : 'text-left'}`}
          >
            {partnerInfo?.partner_name && (
              <div className='flex items-center'>
                <span
                  className={`text-base font-bold ${isMobile ? 'text-center' : 'ml-4'}`}
                >
                  {partnerInfo.partner_name}
                </span>
                <span className='mx-2 h-8 w-px bg-gray-300' />
              </div>
            )}
            <img
              className={`cursor-pointer ${!isMobile && !partnerInfo?.partner_name ? 'ml-4' : ''}`}
              src='/ecics.svg'
              alt='ecics'
              onClick={handleLogoClick}
            />
          </div>
        </div>

        <div className='no-scroll-mobile mx-auto h-[135px] w-full items-center justify-center bg-white lg:max-w-[1280px]'>
          {/*{(partnerInfo?.partner_name || partnerInfo) && (*/}
          {/*  <div className='block h-16 md:hidden'>*/}
          {/*    <BusinessPartnerBar*/}
          {/*      businessName={partnerInfo ? 'Business Partner Name' : ''}*/}
          {/*      companyName={partnerInfo?.partner_name}*/}
          {/*      onBackClick={handleBack}*/}
          {/*      onSaveClick={handleSave}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}
          <div className='relative flex w-full justify-center p-4 px-10 pb-0'>
            {/* Reopen in Day 1.5 */}
            {/*<SecondaryButton*/}
            {/*    icon={<ArrowBackIcon size={11}/>}*/}
            {/*    // className='hidden w-32 rounded-sm md:block' //for save button exist*/}
            {/*    className='absolute left-10 top-4 hidden w-32 rounded-sm md:block'*/}
            {/*    onClick={handleBack}*/}
            {/*>*/}
            {/*    Back*/}
            {/*</SecondaryButton>*/}
            <div>
              <div className='mb-[12px] bg-white text-center text-[24px] font-bold'>
                {headerTitle}
              </div>
              <div className='md:w-[520px]'>
                <ProcessBar
                  currentStep={currentStep}
                  onChange={handleChangeStep}
                  companyName={partnerInfo?.partner_name}
                  isFinalized={isFinalized}
                  isLoading={isLoadingStep}
                  productType={productType}
                />
              </div>
            </div>
            <div></div>
            {/* Reopen in Day 1.5 */}
            {/* <PrimaryButton
                        className='hidden w-32 rounded-sm md:block'
                        onClick={handleSave}
                      >
                        Save
                      </PrimaryButton> */}
          </div>
        </div>

        <div className='mx-auto flex h-[calc(100svh-280px)] w-full flex-col items-center justify-between overflow-y-auto md:h-[calc(100vh-260px)]'>
          {typeof children === 'function'
            ? children({
                onSave: (fn: () => any) => (childSaveRef.current = fn),
              })
            : children}
        </div>
        {(isShowPopupImportant || isShowPopupSingPass) && (
          <ModalImportant
            isShowPopupImportant={isShowPopupImportant || isShowPopupSingPass}
            handleRedirect={() => {
              if (isShowPopupSingPass) {
                router.push(ROUTES.MAID.REVIEW_INFO_DETAIL, {
                  preserveQuery: false,
                });
                setIsShowPopupSingPass(false);
              } else {
                router.push(
                  productType === ProductType.MAID
                    ? ROUTES.INSURANCE_MAID.BASIC_DETAIL
                    : ROUTES.INSURANCE.BASIC_DETAIL,
                );
                setIsShowPopupImportant(false);
              }
            }}
            setIsShowPopupImportant={
              isShowPopupSingPass
                ? setIsShowPopupSingPass
                : setIsShowPopupImportant
            }
          />
        )}
        <NavigationConfirmModal
          visible={isConfirmModalVisible}
          onLeave={handleModalLeave}
          onStay={handleModalStay}
        />
      </>
    </InsuranceLayoutContext.Provider>
  );
}

export default InsuranceLayout;

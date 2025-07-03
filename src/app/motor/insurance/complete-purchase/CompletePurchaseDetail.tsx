'use client';

import { Drawer, Modal } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

import {
  formatBooleanToYesNo,
  formatCurrency,
  formatCurrencyString,
} from '@/libs/utils/utils';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import { CarIcon, PersonIcon } from '@/components/icons/add-on-icons';
import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';
import { PricingSummary } from '@/components/page/FeeBar';
import ReviewSection from '@/components/page/insurance/complete-purchase/ReviewSection';
import PremiumBreakdownContent from '@/components/PremiumBreakdownContent';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { ADDON_CARS } from '@/app/motor/insurance/add-on/AddonAdditionalDriver';
import { ROUTES } from '@/constants/routes';
import { usePayment, useSaveProposal } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import { ProductType } from '../basic-detail/options';

export default function CompletePurchaseDetail({
  onSaveRegister,
  isSingPassFlow = false,
}: {
  onSaveRegister: (fn: () => any) => void;
  isSingPassFlow: boolean;
}) {
  const dispatch = useAppDispatch();
  const router = useRouterWithQuery();
  const { handleBack } = useInsurance();

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);
  const { isMobile } = useDeviceDetection();

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const quote = useAppSelector((state) => state.quote?.quote);
  const vehicleSelected = quote?.data?.vehicle_info_selected;
  const drivers = quote?.data?.add_named_driver_info ?? [];

  const plan = quote?.data?.plans?.find(
    (plan) => quote.data?.selected_plan === plan.title,
  );

  const {
    mutate: payment,
    data: dataPayment,
    isPending: isPendingPay,
  } = usePayment();
  const {
    mutateAsync: saveProposal,
    isSuccess,
    isPending: isPendingSave,
  } = useSaveProposal();
  const handleEditClick = (key: string) => {
    toggleSection(key);
  };
  const routerBySectionKey = (key: string) => {
    if (
      ['personal', 'vehicle', 'policy', 'driving_experiences'].includes(key)
    ) {
      return ROUTES.INSURANCE.BASIC_DETAIL;
    }
    if (['vehicle_details', 'owner'].includes(key)) {
      return ROUTES.INSURANCE.PERSONAL_DETAIL;
    }
    if (key === 'policy_plan') {
      return ROUTES.INSURANCE.PLAN;
    }
    if (['addons', 'driver'].includes(key)) {
      return ROUTES.INSURANCE.ADD_ON;
    }
    return undefined;
  };

  const addonsSectionData = (
    quote?.data?.review_info_premium?.data_section_add_ons || []
  ).map((addon: any) => {
    const baseData = {
      title: addon.title,
      value: formatCurrency(addon.feeSelected / 1.09),
    };
    if (addon.optionLabel !== 'YES') {
      return {
        ...baseData,
        coverage_amount: formatCurrencyString(addon.optionLabel),
      };
    }
    return baseData;
  });

  const addonsIncludedData = (
    quote?.data?.review_info_premium?.add_ons_included_in_this_plan || []
  ).map((item: any) => ({
    title: item.add_on_name,
    value: 'Included',
  }));

  // Addon Additional Driver
  const addonAdditionalDriver = useMemo(() => {
    return plan?.addons.find((addon) => ADDON_CARS.includes(addon.code));
  }, [plan]);
  const baseFeeAdditionalDriver =
    addonAdditionalDriver?.options?.[0]?.premium_with_gst ?? 0;
  const additionalDriverFee = drivers.length
    ? baseFeeAdditionalDriver * (drivers.length - 1)
    : 0;
  const addonDriver = quote?.data?.review_info_premium?.addon_additional_driver;
  const allDrivers = quote?.data?.review_info_premium?.drivers || [];
  const number_of_additional_drivers = allDrivers.length
    ? allDrivers.length
    : 0;
  const addonsAdditionalDriver = addonDriver
    ? [
        {
          title: addonDriver.title,
          value: `SGD ${additionalDriverFee.toFixed(2)}`,
          number_of_additional_drivers,
        },
      ]
    : [];
  const filteredAddonsAdditionalDriver = addonsAdditionalDriver.filter(
    (item) => item.number_of_additional_drivers > 0,
  );

  const getAdditionalDriverData = (drivers: any[] = []) => {
    return drivers.flatMap((driver, index) => [
      {
        title: `Additional Driver ${index + 1}`,
        value: '',
        isTitleOnly: true,
      },
      {
        title: 'Name',
        value: driver.name,
      },
      {
        title: 'NRIC/FIN',
        value: driver.nric_or_fin,
      },
    ]);
  };

  const getDrivingLicenses = (drivingData?: any) => {
    if (!drivingData || !drivingData.qdl?.classes) return [];

    const validityDesc = drivingData.qdl.validity?.desc || '';
    const expiryDate = drivingData.qdl.expirydate?.value || '';

    return drivingData.qdl.classes.map((cls: any) => ({
      title: '',
      value: {
        class: cls.class?.value,
        issuedDate: cls.issuedate?.value,
        expiryDate: expiryDate,
        validity: validityDesc,
      },
    }));
  };

  const getDriverSections = (drivers: any[] = []) => {
    return drivers.map((driver, index) => {
      const data = [
        { title: 'Name as Per NRIC/FIN', value: driver.name },
        { title: 'NRIC/FIN', value: driver.nric_or_fin },
        { title: 'Date of Birth', value: driver.date_of_birth },
        { title: 'Gender', value: driver.gender },
        { title: 'Marital Status', value: driver.marital_status },
        {
          title: 'Driving Experience',
          value: `${driver.driving_experience} years`,
        },
        {
          title: 'Do you have a claim in the past 3 years',
          value: formatBooleanToYesNo(driver.is_claim_in_3_years),
        },
      ];

      return {
        key: `driver-${index}`,
        title: `Additional Driver ${index + 1}`,
        description: driver.name,
        icon: <AdditionalDriverDetailsIcon className='text-white' />,
        data,
      };
    });
  };

  const selectedPlanTitle = quote?.data?.selected_plan || 'N/A';
  const plans = quote?.data?.plans || [];
  const matchedPlan = plans.find(
    (plan) => plan.title && plan.title.includes(selectedPlanTitle),
  );
  const addonsTitles =
    matchedPlan?.benefits
      ?.filter((benefit) => benefit.is_active)
      .map((benefit) => benefit.name)
      .filter(Boolean) || [];

  const sharedDataMap: {
    [key: string]: { title: string; value: any; coverage_amount?: string }[];
  } = {
    personal: [
      {
        title: 'Email Address',
        value: quote?.data?.personal_info?.email || 'N/A',
      },
      {
        title: 'Phone Number',
        value: quote?.data?.personal_info?.phone,
      },
      ...(isSingPassFlow
        ? []
        : [
            {
              title: 'Date of Birth',
              value: quote?.data?.personal_info?.date_of_birth,
            },
          ]),
    ],
    ...(isSingPassFlow
      ? {
          vehicle_details: [
            {
              title: 'Vehicle Number',
              value: vehicleSelected?.vehicle_number || 'N/A',
            },
            {
              title: 'Vehicle Make',
              value: vehicleSelected?.vehicle_make || 'N/A',
            },
            {
              title: 'Vehicle Model',
              value: vehicleSelected?.vehicle_model || 'N/A',
            },
            {
              title: 'First Registration Date',
              value: vehicleSelected?.first_registered_year || 'N/A',
            },
            {
              title: 'Years of Manufacture',
              value: vehicleSelected?.year_of_manufacture || 'N/A',
            },
            {
              title: 'Engine Number',
              value: vehicleSelected?.engine_number || 'N/A',
            },
            {
              title: 'Chassis Number',
              value: vehicleSelected?.chasis_number || 'N/A',
            },
            {
              title: 'Engine Capacity',
              value: vehicleSelected?.engine_capacity
                ? `${vehicleSelected?.engine_capacity} CC`
                : 'N/A',
            },
            {
              title: 'Power Rate',
              value: vehicleSelected?.power_rate || 'N/A',
            },
          ],
        }
      : {
          vehicle: [
            {
              title: 'Vehicle Make',
              value: vehicleSelected?.vehicle_make || 'N/A',
            },
            {
              title: 'Vehicle Model',
              value: vehicleSelected?.vehicle_model || 'N/A',
            },
            {
              title: "Vehicle's Year of Registration",
              value: vehicleSelected?.first_registered_year || 'N/A',
            },
            {
              title: 'Vehicle Financed By',
              value: quote?.company?.name || 'N/A',
            },
          ],
        }),
    ...(isSingPassFlow
      ? {}
      : {
          policy: [
            {
              title: 'Policy Start Date',
              value:
                quote?.data?.insurance_additional_info?.start_date || 'N/A',
            },
            {
              title: 'Policy End Date',
              value: quote?.data?.insurance_additional_info?.end_date || 'N/A',
            },
          ],
          driving_experiences: [
            {
              title: 'Years of Driving Experience',
              value: quote?.data?.personal_info?.driving_experience
                ? `${quote.data.personal_info.driving_experience} years`
                : 'N/A',
            },
            {
              title: 'Your No Claim Discount',
              value: `${quote?.data?.insurance_additional_info?.no_claim_discount}%`,
            },
            {
              title: 'Number of claims in the past 3 years',
              value:
                quote?.data?.insurance_additional_info?.no_of_claim || 'N/A',
            },
          ],
        }),
    ...(isSingPassFlow
      ? {}
      : {
          vehicle_details: [
            {
              title: 'Chassis Number',
              value: vehicleSelected?.chasis_number || 'N/A',
            },
            {
              title: 'Engine Number',
              value: vehicleSelected?.engine_number || 'N/A',
            },
            {
              title: 'Vehicle Number',
              value: vehicleSelected?.vehicle_number || 'N/A',
            },
          ],
        }),
    policy_plan: [
      {
        title: 'Selected Plan',
        value: selectedPlanTitle,
      },
      {
        title: 'Plan Details',
        value: addonsTitles.length > 0 ? addonsTitles.join(', ') : 'N/A',
      },
    ],
    addons:
      addonsSectionData.length === 0 &&
      addonsIncludedData.length === 0 &&
      filteredAddonsAdditionalDriver.length === 0
        ? [{ title: 'You have no Add Ons selected', value: '' }]
        : [
            ...addonsSectionData,
            ...addonsIncludedData,
            ...filteredAddonsAdditionalDriver,
          ],
    ...(isSingPassFlow
      ? {
          policy: [
            {
              title: 'Policy Start Date',
              value:
                quote?.data?.insurance_additional_info?.start_date || 'N/A',
            },
            {
              title: 'Policy End Date',
              value: quote?.data?.insurance_additional_info?.end_date || 'N/A',
            },
          ],
        }
      : {}),
    ...(isSingPassFlow
      ? {
          owner: [
            {
              title: 'Name as per NRIC',
              value: quote?.data?.personal_info?.name ?? 'N/A',
            },
            {
              title: 'Gender',
              value: quote?.data?.personal_info?.gender ?? 'N/A',
            },
            {
              title: 'Date of Birth',
              value: quote?.data?.personal_info?.date_of_birth ?? 'N/A',
            },
            {
              title: 'NRIC/FIN',
              value: quote?.data?.personal_info?.nric ?? 'N/A',
            },
            {
              title: 'Marital Status',
              value: quote?.data?.personal_info?.marital_status ?? 'N/A',
            },
            {
              title: 'Address Line 1',
              value: quote?.data?.personal_info?.address?.[0] ?? 'N/A',
            },
            {
              title: 'Address Line 2',
              value: quote?.data?.personal_info?.address?.[1]
                ? quote?.data?.personal_info?.address?.[1]
                : 'N/A',
            },
            {
              title: 'Address Line 3',
              value: quote?.data?.personal_info?.address?.[2]
                ? quote?.data?.personal_info?.address?.[2]
                : 'N/A',
            },
            {
              title: 'Postal Code',
              value: quote?.data?.personal_info?.post_code ?? 'N/A',
            },
          ],
        }
      : {
          owner: [
            {
              title: 'Name as per NRIC',
              value: quote?.data?.personal_info?.name ?? 'N/A',
            },
            {
              title: 'NRIC/FIN',
              value: quote?.data?.personal_info?.nric ?? 'N/A',
            },
            {
              title: 'Gender',
              value: quote?.data?.personal_info?.gender ?? 'N/A',
            },
            {
              title: 'Marital Status',
              value: quote?.data?.personal_info?.marital_status ?? 'N/A',
            },
            {
              title: 'Address Line 1',
              value: quote?.data?.personal_info?.address?.[0] ?? 'N/A',
            },
            {
              title: 'Address Line 2',
              value: quote?.data?.personal_info?.address?.[1]
                ? quote?.data?.personal_info?.address?.[1]
                : 'N/A',
            },
            {
              title: 'Address Line 3',
              value: quote?.data?.personal_info?.address?.[2]
                ? quote?.data?.personal_info?.address?.[2]
                : 'N/A',
            },
            {
              title: 'Postal Code',
              value: quote?.data?.personal_info?.post_code ?? 'N/A',
            },
          ],
        }),
    ...(isSingPassFlow
      ? {
          driving_licenses: getDrivingLicenses(
            quote?.data?.data_from_singpass?.drivinglicence,
          ),
          driving_experiences: [
            {
              title: 'Your No Claim Discount',
              value: `${quote?.data?.insurance_additional_info?.no_claim_discount}%`,
            },
            {
              title: 'Number of claims in the past 3 years',
              value:
                quote?.data?.insurance_additional_info?.no_of_claim || 'N/A',
            },
          ],
        }
      : {}),
    driver: getAdditionalDriverData(quote?.data?.add_named_driver_info),
  };

  const sections = [
    {
      key: 'personal',
      title: isSingPassFlow ? 'Contact Info' : 'Personal Information',
    },
    ...(isSingPassFlow
      ? [
          {
            key: 'vehicle_details',
            title: 'Vehicle Details',
          },
        ]
      : [
          {
            key: 'vehicle',
            title: 'Vehicle Information',
            description: `${vehicleSelected?.vehicle_make} ${vehicleSelected?.vehicle_model} ${vehicleSelected?.chasis_number}`,
            icon: <CarIcon className='text-white' />,
          },
        ]),
    ...(isSingPassFlow
      ? []
      : [
          {
            key: 'policy',
            title: 'Policy Start & End Date',
            description: `${plan?.title} Plan`,
            icon: <PolicyPlanIcon className='text-white' />,
          },
          {
            key: 'driving_experiences',
            title: 'Driving Experiences',
          },
        ]),
    {
      key: 'policy_plan',
      title: 'Policy Plan',
    },
    {
      key: 'addons',
      title: 'Add-ons',
      description: 'Additional Named Driver(s)',
      icon: <AddOnsSelectedIcon className='text-white' />,
    },
    ...(isSingPassFlow
      ? [
          {
            key: 'policy',
            title: 'Policy Start & End Date',
            description: `${plan?.title} Plan`,
            icon: <PolicyPlanIcon className='text-white' />,
          },
        ]
      : []),
    ...(isSingPassFlow
      ? []
      : [
          {
            key: 'vehicle_details',
            title: 'Vehicle Details',
          },
        ]),
    {
      key: 'owner',
      title: 'Personal Info (Main Driver)',
      description: `${quote?.data?.personal_info?.name}  ${quote?.data?.vehicle_info_selected?.vehicle_number}`,
      icon: <PersonIcon className='text-white' />,
    },
    ...(isSingPassFlow
      ? [
          {
            key: 'driving_licenses',
            title: 'Driving Licenses',
          },
          {
            key: 'driving_experiences',
            title: 'Driving Experiences',
          },
        ]
      : []),
    {
      key: 'driver',
      title: 'Additional Driver Details',
      description: 'Steve Smith',
      icon: <AdditionalDriverDetailsIcon className='text-white' />,
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      payment(key);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (dataPayment?.payment_url) {
      router.push(dataPayment.payment_url);
    }
  }, [dataPayment]);

  const onPay = async () => {
    const data: any = {
      key: key,
      selected_plan: quote?.data?.selected_plan,
      selected_addons: quote?.data?.selected_addons,
      add_named_driver_info: quote?.data?.add_named_driver_info,
    };
    saveProposal({
      data,
      productType: PRODUCT_NAME.CAR,
    }).then((res) => {
      if (!res?.final_premium) return;
      dispatch(updateQuote({ is_finalized: true }));
    });
  };

  const totalAddonFeeSelected =
    quote?.data?.review_info_premium?.data_section_add_ons.reduce(
      (total: number, addon: any) => total + (addon.feeSelected || 0),
      0,
    );

  const totalAddonDriver =
    quote?.data?.review_info_premium?.drivers?.reduce(
      (total: number, driver: any, index: number) => {
        if (index === 0) return total;
        return (
          total +
          (quote?.data?.review_info_premium?.addon_additional_driver
            ?.options?.[0]?.premium_with_gst
            ? quote?.data?.review_info_premium?.addon_additional_driver
                .options[0].premium_with_gst
            : 0)
        );
      },
      0,
    ) || 0;

  const totalAdditionFee = totalAddonFeeSelected + totalAddonDriver;
  const planFreeTotal =
    (quote?.data?.review_info_premium?.total_final_price || 0) -
    (totalAdditionFee || 0);

  const _renderPremiumBreakdownContent = (
    <PremiumBreakdownContent
      quoteInfo={quote}
      dataSelectedAddOn={quote?.data?.review_info_premium?.data_section_add_ons}
      drivers={quote?.data?.review_info_premium?.drivers ?? []}
      addonAdditionalDriver={
        quote?.data?.review_info_premium?.addon_additional_driver
      }
      pricePlanMain={quote?.data?.review_info_premium?.price_plan ?? 0}
      couponDiscount={quote?.data?.review_info_premium?.coupon_discount ?? 0}
      tax={1.09}
      gst={quote?.data?.review_info_premium?.gst ?? 0}
      netPremium={quote?.data?.review_info_premium?.net_premium ?? 0}
      addonsIncluded={
        quote?.data?.review_info_premium?.add_ons_included_in_this_plan
      }
      onClose={() => setIsShowPopupPremium(false)}
    />
  );

  return (
    <div className='flex w-full flex-col items-center px-4 py-4 md:py-4'>
      <div
        className={`flex w-full flex-col justify-center md:gap-10 ${isMobile ? 'pb-20 md:flex-row' : 'item-center max-w-[1280px] flex-col p-4 pb-28'}`}
      >
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <div className='pb-4 text-[16px] font-bold underline'>Summary</div>
            {sections.map((section, index) => {
              if (section.key === 'driver') {
                const drivers = getDriverSections(
                  quote?.data?.add_named_driver_info,
                );
                return drivers.map((driverSection) => (
                  <ReviewSection
                    key={driverSection.key}
                    title={driverSection.title}
                    description={driverSection.description}
                    icon={driverSection.icon}
                    data={driverSection.data}
                    isExpanded={true}
                    setShowModal={setShowModal}
                    editRoute={ROUTES.INSURANCE.ADD_ON}
                    isPendingSave={isPendingSave}
                    isPendingPay={isPendingPay}
                    isSingPassFlow={isSingPassFlow}
                  />
                ));
              }

              // Handle special case for policy_plan + addons on desktop
              if (
                !isMobile &&
                section.key === 'policy_plan' &&
                sections[index + 1]?.key === 'addons'
              ) {
                const policyData = sharedDataMap['policy_plan'] || [];
                const addonsData = sharedDataMap['addons'] || [];

                return (
                  <div key='policy_plan' className='flex gap-4'>
                    <ReviewSection
                      key='policy_plan'
                      title='Policy Plan'
                      description={section.description}
                      data={policyData}
                      isExpanded={true}
                      sectionKey='policy_plan'
                      setShowModal={setShowModal}
                      editRoute={routerBySectionKey('policy_plan')}
                      isPendingSave={isPendingSave}
                      isPendingPay={isPendingPay}
                      isSingPassFlow={isSingPassFlow}
                    />
                    <ReviewSection
                      key='addons'
                      title='Add-ons'
                      description={section.description}
                      data={addonsData}
                      isExpanded={true}
                      sectionKey='addons'
                      setShowModal={setShowModal}
                      editRoute={routerBySectionKey('addons')}
                      isPendingSave={isPendingSave}
                      isPendingPay={isPendingPay}
                      isSingPassFlow={isSingPassFlow}
                    />
                  </div>
                );
              }

              // Skip rendering 'addons' if already rendered with 'policy_plan'
              if (
                !isMobile &&
                section.key === 'addons' &&
                sections[index - 1]?.key === 'policy_plan'
              ) {
                return null;
              }

              return (
                <ReviewSection
                  key={section.key}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  data={sharedDataMap[section.key] || []}
                  isExpanded={true}
                  sectionKey={section.key}
                  setShowModal={setShowModal}
                  editRoute={routerBySectionKey(section.key)}
                  isPendingSave={isPendingSave}
                  isPendingPay={isPendingPay}
                  isSingPassFlow={isSingPassFlow}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className='mt-16 w-full bg-[#FFFEFF] md:mt-2'>
        <PricingSummary
          planFee={planFreeTotal}
          addonFee={totalAdditionFee}
          discount={quote?.promo_code?.discount || 0}
          loading={isPendingSave || isPendingPay}
          title='Premium breakdown'
          textButton='Submit & Pay'
          handleBack={handleBack}
          onClick={onPay}
          setIsShowPopupPremium={setIsShowPopupPremium}
          productType={ProductType.CAR}
        />
        {isMobile ? (
          <Drawer
            placement='bottom'
            open={isShowPopupPremium}
            onClose={() => setIsShowPopupPremium(false)}
            closable={false}
            height='auto'
            className='w-full rounded-t-xl'
          >
            {_renderPremiumBreakdownContent}
          </Drawer>
        ) : (
          <Modal
            open={isShowPopupPremium}
            onCancel={() => setIsShowPopupPremium(false)}
            closable={false}
            maskClosable={true}
            keyboard={true}
            footer={null}
            width={385}
            centered
          >
            <div>{_renderPremiumBreakdownContent}</div>
          </Modal>
        )}
      </div>
    </div>
  );
}

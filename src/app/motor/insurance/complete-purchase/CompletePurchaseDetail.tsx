'use client';

import { Drawer } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Option } from '@/libs/types/quote';
import { formatCurrency } from '@/libs/utils/utils';

import { CarIcon, PersonIcon } from '@/components/icons/add-on-icons';
import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import BasicDetailsIcon from '@/components/icons/BasicDetailsIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';
import { PrimaryButton } from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';
import { usePayment, useSaveProposal } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import ReviewDesktop from './ReviewDesktop';
import ReviewSection from './ReviewSection';
import { AddOnFormat, mapIconToTypeAddOn } from '../add-on/AddonDetail';
import { PricingSummary } from '../components/FeeBar';

function calculateFee(
  option: Option,
  addonsAdded: Record<string, string>,
): number {
  if (!option?.dependencies || option.dependencies.length === 0) {
    return option.premium_with_gst ?? 0;
  }
  const dependency = option.dependencies.find((dep) =>
    dep.conditions.every(
      (condition) => addonsAdded[condition.addon.code] === condition.value,
    ),
  );
  return dependency?.premium_with_gst ?? 0;
}

export default function CompletePurchaseDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouterWithQuery();

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
    switch (key) {
      case 'basic':
      case 'vehicle':
      case 'policy':
        return ROUTES.INSURANCE.BASIC_DETAIL;
      case 'addons':
      case 'driver':
        return ROUTES.INSURANCE.ADD_ON;
      case 'owner':
        return ROUTES.INSURANCE.PERSONAL_DETAIL;
      default:
        return undefined;
    }
  };

  const addonsSectionData = (
    quote?.data?.review_info_premium?.data_section_add_ons || []
  ).map((addon: any) => ({
    title: addon.title,
    value: formatCurrency(addon.feeSelected / 1.09),
  }));

  const addonsIncludedData = (
    quote?.data?.review_info_premium?.add_ons_included_in_this_plan || []
  ).map((item: any) => ({
    title: item.add_on_name,
    value: 'Included',
  }));

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

  const getDriverSections = (drivers: any[] = []) => {
    return drivers.map((driver, index) => {
      const data = [
        { title: 'Name as Per NRIC/FIN', value: driver.name },
        { title: 'NRIC/FIN', value: driver.nric_or_fin },
        { title: 'Date of Birth', value: driver.date_of_birth },
        { title: 'Gender', value: driver.gender },
        { title: 'Marital Status', value: driver.marital_status },
        { title: 'Driving Experience', value: driver.driving_experience },
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

  const sharedDataMap: { [key: string]: { title: string; value: any }[] } = {
    basic: [
      {
        title: 'Policy Start Date',
        value: quote?.data?.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data?.insurance_additional_info?.end_date,
      },
      {
        title: 'No Claim Discount',
        value: `${quote?.data?.insurance_additional_info?.no_claim_discount}%`,
      },
      {
        title: 'Number of claims in last 3 years',
        value: quote?.data?.insurance_additional_info?.no_of_claim,
      },
      { title: 'Vehicle financed by', value: quote?.company?.name || 'N/A' },
    ],
    vehicle: [
      {
        title: 'Vehicle Number',
        value: vehicleSelected?.vehicle_number || 'N/A',
      },
      {
        title: 'Year of Registration',
        value: vehicleSelected?.first_registered_year || 'N/A',
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
        title: 'Chassis Number',
        value: vehicleSelected?.chasis_number || 'N/A',
      },
      {
        title: 'Engine Number',
        value: vehicleSelected?.engine_number || 'N/A',
      },
      // { title: 'Engine Capacity', value: 'N/A' },
      // { title: 'Power Rate', value: 'N/A' },
      // { title: 'Year of Manufacture', value: 'N/A' },
    ],
    policy: [
      { title: 'Selected Plan', value: quote?.data?.selected_plan || 'N/A' },
      {
        title: 'Policy Start Date',
        value: quote?.data?.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data?.insurance_additional_info?.end_date || 'N/A',
      },
    ],
    addons:
      addonsSectionData.length === 0 && addonsIncludedData.length === 0
        ? [{ title: 'You have no Add Ons selected', value: '' }]
        : [...addonsSectionData, ...addonsIncludedData],
    driver: getAdditionalDriverData(quote?.data?.add_named_driver_info),
    owner: [
      { title: 'Name', value: quote?.data?.personal_info?.name ?? 'N/A' },
      { title: 'NRIC/FIN', value: quote?.data?.personal_info?.nric ?? 'N/A' },
      { title: 'Gender', value: quote?.data?.personal_info?.gender ?? 'N/A' },
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
  };

  const sections = [
    {
      key: 'basic',
      title: 'Basic Details',
      description: 'Policy Period NCD No. of claims',
      icon: <BasicDetailsIcon className='text-white' />,
    },
    {
      key: 'vehicle',
      title: 'Vehicle Details',
      description: `${vehicleSelected?.vehicle_make} ${vehicleSelected?.vehicle_model} ${vehicleSelected?.chasis_number}`,
      icon: <CarIcon className='text-white' />,
    },
    {
      key: 'policy',
      title: 'Policy Plan',
      description: `${plan?.title} Plan`,
      icon: <PolicyPlanIcon className='text-white' />,
    },
    {
      key: 'addons',
      title: 'Add Ons Selected',
      description: 'Additional Named Driver(s)',
      icon: <AddOnsSelectedIcon className='text-white' />,
    },
    {
      key: 'driver',
      title: 'Additional Driver Details',
      description: 'Steve Smith',
      icon: <AdditionalDriverDetailsIcon className='text-white' />,
    },
    {
      key: 'owner',
      title: 'Main Driver Details',
      description: `${quote?.data?.personal_info?.name}  ${quote?.data?.vehicle_info_selected?.vehicle_number}`,
      icon: <PersonIcon className='text-white' />,
    },
  ];

  const [addonsAdded, setAddonsAdded] = useState<any>(null);
  const [addonsSelected, setAddonsSelected] = useState<any>(null);

  const defaultAddonsAdded = useMemo(() => {
    if (!plan?.addons.length) return {};
    const addonCodes = plan.addons.map((addon) => addon.code);
    return Object.fromEntries(addonCodes.map((code) => [code, 'NO']));
  }, [plan]);

  const defaultAddonsSelected = useMemo(() => {
    if (!plan?.addons.length) return {};
    const selected_addons = quote?.data?.selected_addons ?? {};
    return plan.addons.reduce(
      (acc: Record<string, string>, addon) => {
        if (addon.type === 'checkbox') {
          acc[addon.code] = 'YES';
        } else {
          const selectedValue = selected_addons?.[addon.code];
          if (selectedValue && selectedValue !== 'NO') {
            acc[addon.code] = selectedValue;
          } else {
            const defaultOption = addon.options.find(
              (option) => option.id === addon.default_option_id,
            );
            acc[addon.code] = defaultOption
              ? defaultOption.value
              : addon.options[0]?.value;
          }
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [plan]);

  useEffect(() => {
    // setDrivers(quoteInfo?.data?.add_named_driver_info ?? []);
    setAddonsAdded(defaultAddonsAdded);
    setAddonsSelected(defaultAddonsSelected);
  }, [defaultAddonsAdded, defaultAddonsSelected]);

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
    saveProposal(data).then((res) => {
      if (!res?.final_premium) return;
      dispatch(updateQuote({ is_finalized: true }));
    });
  };

  const onClosePopup = () => {
    setIsShowPopupPremium(false);
  };

  const addons = plan?.addons ?? [];

  const addonsFormatted: AddOnFormat[] = addons.map((addon) => {
    // map the icon to the addon
    const iconMatched = mapIconToTypeAddOn.find(
      (item) => item.code === addon.code,
    );

    // For feeAdded use the "addonsAdded" defaults
    const initValueForAdded = addonsAdded?.[addon.code] ?? null;
    const selectedOptionForAdded = addon.options.find(
      (option) => option.value === initValueForAdded,
    );
    const feeAdded = selectedOptionForAdded
      ? calculateFee(selectedOptionForAdded, addonsAdded)
      : 0;

    // For feeSelected use the "addonsSelected" defaults
    const initValueForSelected = addonsSelected?.[addon.code] ?? null;
    const activeOption = addon.options.find(
      (option) => option.value === initValueForSelected,
    );
    const feeSelected = activeOption
      ? calculateFee(activeOption, addonsAdded)
      : 0;

    return {
      ...addon,
      icon: iconMatched?.icon || null,
      selectedOption: selectedOptionForAdded ?? null,
      feeAdded: feeAdded,
      activeOption: activeOption ?? null,
      feeSelected: feeSelected,
    };
  });

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

  const _renderPremium = () => {
    const tax = 1.09;
    const drivers = quote?.data?.review_info_premium?.drivers;
    const addonAdditionalDriver =
      quote?.data?.review_info_premium?.addon_additional_driver;
    const AddOnIncludedInPlan =
      quote?.data?.review_info_premium?.add_ons_included_in_this_plan;

    return (
      <div className='w-full md:max-w-[400px]'>
        {/* <div className='flex h-[50px] justify-end'>
          <div className='flex w-[150px] cursor-pointer items-center justify-center border border-[#00ADEF] py-3 font-normal'>
            Save
          </div>
        </div> */}
        <div className='flex w-full flex-col gap-3 rounded-lg py-4 md:mt-6 md:border md:border-[#E4E4E4]'>
          <p className='text-center text-xl font-semibold leading-[30px] text-[#171A1F]'>
            Premium Breakdown
          </p>
          <div className='flex w-full flex-col gap-4'>
            <div className='flex flex-col gap-4 border-b border-[#E4E4E4] px-4 py-2'>
              <div className='flex flex-row justify-between text-base leading-[30px] text-[#171A1F]'>
                <p className=' font-normal'>
                  {quote?.data?.selected_plan ?? ''}
                </p>
                <p>
                  {formatCurrency(
                    quote?.data?.review_info_premium?.price_plan ?? 0,
                  )}
                </p>
              </div>
              {quote?.promo_code && (
                <div className='flex flex-row justify-between text-sm font-semibold text-[#00ADEF]'>
                  <p>Coupon Discount</p>
                  <p>
                    -
                    {formatCurrency(
                      quote?.data?.review_info_premium?.coupon_discount ?? 0,
                    )}
                  </p>
                </div>
              )}

              <div className='flex flex-col border-b border-[#E4E4E4] py-2'>
                <p className='font-bold text-[#171A1F]'>Add-on:</p>
                <div className='flex flex-col gap-1'>
                  {quote?.data?.review_info_premium?.data_section_add_ons.map(
                    (addon: any) => (
                      <p
                        key={addon.title}
                        className='flex flex-row justify-between'
                      >
                        {addon.title}:{' '}
                        <span>{formatCurrency(addon.feeSelected / tax)}</span>
                      </p>
                    ),
                  )}
                </div>
                <div>
                  {drivers && drivers.length > 0 && (
                    <div className=''>
                      <p className='my-1 text-sm font-semibold text-[#303030]'>
                        Additional Named Driver(s)
                      </p>
                      {drivers.map((driver, index) => (
                        <div
                          key={index}
                          className='flex flex-row items-center justify-between text-sm text-[#636262]'
                        >
                          <p>{driver.name}</p>
                          <p>
                            {index === 0
                              ? 'Free'
                              : addonAdditionalDriver?.options?.[0]
                                    ?.premium_with_gst
                                ? formatCurrency(
                                    addonAdditionalDriver.options[0]
                                      .premium_with_gst / 1.09,
                                  )
                                : ''}{' '}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  {AddOnIncludedInPlan && AddOnIncludedInPlan.length > 0 && (
                    <div className='mt-4 flex flex-col gap-2'>
                      {AddOnIncludedInPlan.map((item, index) => (
                        <div
                          key={index}
                          className='flex flex-row items-center justify-between'
                        >
                          <span>{item.add_on_name}</span>
                          <span>INCLUDED</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-2 border-b border-[#E4E4E4] py-2 text-base font-normal leading-[30px] text-[#171A1F]'>
                <div className='flex flex-row justify-between'>
                  <p>Net Premium</p>
                  <p>
                    {formatCurrency(
                      quote?.data?.review_info_premium?.net_premium ?? 0,
                    )}
                  </p>
                </div>
                <div className='flex flex-row justify-between'>
                  <p>GST</p>
                  <p>
                    {formatCurrency(quote?.data?.review_info_premium?.gst ?? 0)}
                  </p>
                </div>
              </div>
              <div className='flex flex-row justify-between font-bold'>
                <p>Total (including GST)</p>
                <p>
                  {formatCurrency(
                    quote?.data?.review_info_premium?.total_final_price ?? 0,
                  )}
                </p>
              </div>
            </div>

            <PrimaryButton
              onClick={!isMobile ? onPay : onClosePopup}
              loading={isPendingSave || isPendingPay}
              className='mx-auto w-[80%] cursor-pointer rounded-lg px-4 py-3 text-center text-base font-bold leading-[21px] text-white'
            >
              {isMobile ? 'Okay' : 'Pay'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex w-full flex-col items-center px-4 py-4 md:py-4'>
      <div className='flex w-full max-w-[1200px] flex-col justify-center md:flex-row md:gap-10'>
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <h1 className='text-xl font-semibold text-[#080808] md:text-center md:text-[32px] md:font-bold md:leading-[48px] md:text-[#171A1F]'>
              Review your details
            </h1>

            {sections.map((section) => {
              if (section.key === 'driver') {
                const drivers = getDriverSections(
                  quote?.data?.add_named_driver_info,
                );
                return drivers.map((driverSection) =>
                  isMobile ? (
                    <ReviewSection
                      key={driverSection.key}
                      title={driverSection.title}
                      description={driverSection.description}
                      icon={driverSection.icon}
                      data={driverSection.data}
                      isExpanded={!!expandedSections[driverSection.key]}
                      onToggle={() => handleEditClick(driverSection.key)}
                      setShowModal={setShowModal}
                      editRoute={ROUTES.INSURANCE.ADD_ON}
                    />
                  ) : (
                    <ReviewDesktop
                      key={driverSection.key}
                      title={driverSection.title}
                      data={driverSection.data}
                      setShowModal={setShowModal}
                      editRoute={ROUTES.INSURANCE.ADD_ON}
                      isPendingSave={isPendingSave}
                      isPendingPay={isPendingPay}
                    />
                  ),
                );
              }

              return isMobile ? (
                <ReviewSection
                  key={section.key}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  data={sharedDataMap[section.key] || []}
                  isExpanded={!!expandedSections[section.key]}
                  onToggle={() => handleEditClick(section.key)}
                  setShowModal={setShowModal}
                  editRoute={routerBySectionKey(section.key)}
                />
              ) : (
                <ReviewDesktop
                  key={section.key}
                  title={section.title}
                  data={sharedDataMap[section.key] || []}
                  setShowModal={setShowModal}
                  editRoute={routerBySectionKey(section.key)}
                  isPendingSave={isPendingSave}
                  isPendingPay={isPendingPay}
                />
              );
            })}
          </div>
        </div>

        {!isMobile && _renderPremium()}
      </div>
      {isMobile && (
        <div className='mt-16 w-full bg-[#FFFEFF] md:mt-2'>
          <PricingSummary
            planFee={planFreeTotal}
            addonFee={totalAdditionFee}
            discount={quote?.promo_code?.discount || 0}
            loading={isPendingSave || isPendingPay}
            title='Premium breakdown'
            textButton='Pay'
            onClick={onPay}
            setIsShowPopupPremium={setIsShowPopupPremium}
          />
          <Drawer
            placement='bottom'
            open={isShowPopupPremium}
            onClose={() => setIsShowPopupPremium(false)}
            closable={false}
            height='auto'
            className='max-h-[70svh] w-full overflow-y-auto rounded-t-xl'
          >
            {_renderPremium()}
          </Drawer>
        </div>
      )}
    </div>
  );
}

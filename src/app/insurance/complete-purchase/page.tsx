'use client';
import { useEffect, useMemo, useState } from 'react';
import BasicDetailsIcon from '@/components/icons/BasicDetailsIcon';
import ReviewSection from './ReviewSection';
import PersonIcon from '@/components/icons/PersonIcon';
import NewOldReplacementIcon from '@/components/icons/NewOldReplacementIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import ReviewDesktop from './ReviewDesktop';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { ROUTES } from '@/constants/routes';
import {
  useGetQuote,
  usePayment,
  useSaveProposalFinalize,
} from '@/hook/insurance/quote';
import { Option } from '@/libs/types/quote';
import { PricingSummary } from '../components/FeeBar';
import { useSearchParams } from 'next/navigation';
import { Spin } from 'antd';
import KeyIcon from '@/components/icons/KeyIcon';
import RepairIcon from '@/components/icons/RepairIcon';
import RoadSideIcon from '@/components/icons/RoadSideIcon';
import EnhancedAccidentIcon from '@/components/icons/EnhancedAccidentIcon';
import PersonalAccidentIcon from '@/components/icons/PersonalAccidentIcon';
import { SecondaryButton } from '@/components/ui/buttons';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { AddOnFormat } from '../add-on/AddonDetail';
import ImportantNoticeModal from './review-your-detail/modal/ImportantNoticeModal';

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

const mapCodeTypeAddon = [
  {
    code: 'CAR_COM_ANW',
    icon: <KeyIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_AJE',
    icon: <RepairIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_AND',
    icon: <RoadSideIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_BUN',
    icon: <EnhancedAccidentIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_LOU',
    icon: <PersonalAccidentIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_PAC',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_MDE',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_RSA',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_KRC',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
  {
    code: 'CAR_COM_NOR',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
  },
];

export default function Page() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const { isMobile } = useDeviceDetection();
  const [isShowRecalculation, setIsShowRecalculation] = useState(false);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const router = useRouterWithQuery();
  const { data: quote, isLoading } = useGetQuote(key);
  const { mutate: saveProposalFinalize } = useSaveProposalFinalize();
  const {
    mutate: payment,
    data: dataPayment,
    isPending,
    isSuccess,
  } = usePayment();

  const handleEditClick = (key: string) => {
    toggleSection(key);
  };

  const routerBySectionKey = (key: string) => {
    switch (key) {
      case 'basic':
      case 'vehicle':
      case 'owner':
        return ROUTES.INSURANCE.BASIC_DETAIL;
      case 'addons':
      case 'driver':
        return ROUTES.INSURANCE.ADD_ON;
      case 'policy':
        return ROUTES.INSURANCE.PLAN;
      default:
        return undefined;
    }
  };

  const addonsSectionData = Object.entries(quote?.data.selected_addons || {})
    .filter(([, selectedValue]) => selectedValue !== 'NO')
    .map(([code, selectedValue]) => {
      const addon = quote?.data.plans?.[0]?.addons?.find(
        (a: any) => a.code === code,
      );
      const label =
        addon?.options?.find((opt: any) => opt.value === selectedValue)
          ?.label || selectedValue;

      return {
        title: addon?.title || code,
        value: label,
      };
    });

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
        title: 'NRIC',
        value: driver.nric_or_fin,
      },
    ]);
  };

  const getDriverSections = (drivers: any[] = []) => {
    return drivers.map((driver, index) => {
      const data = [
        { title: 'Name as Per NRIC', value: driver.name },
        { title: 'NRIC', value: driver.nric_or_fin },
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
        value: quote?.data.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data.insurance_additional_info?.end_date,
      },
      {
        title: 'No Claim Discount',
        value: `${quote?.data.insurance_additional_info?.no_claim_discount}%`,
      },
      {
        title: 'Number of claims in last 3 years',
        value: quote?.data.insurance_additional_info?.no_of_claim,
      },
      { title: 'Vehicle financed by', value: quote?.company?.name || 'N/A' },
    ],
    vehicle: [
      {
        title: 'Vehicle  Number',
        value: quote?.data.vehicle_info_selected?.chasis_number || 'N/A',
      },
      {
        title: 'Year of Registration',
        value:
          quote?.data.vehicle_info_selected?.first_registered_year || 'N/A',
      },
      {
        title: 'Vehicle Make',
        value: quote?.data.vehicle_info_selected?.vehicle_make || 'N/A',
      },
      {
        title: 'Vehicle Model',
        value: quote?.data.vehicle_info_selected?.vehicle_model || 'N/A',
      },
      {
        title: 'Chassis Number',
        value: quote?.data.vehicle_info_selected?.chasis_number || 'N/A',
      },
      {
        title: 'Engine Number',
        value: quote?.data.vehicle_info_selected?.engine_number || 'N/A',
      },
      { title: 'Engine Capacity', value: 'N/A' },
      { title: 'Power Rate', value: 'N/A' },
      { title: 'Year of Manufacture', value: 'N/A' },
    ],
    policy: [
      { title: 'Selected Plan', value: quote?.data.selected_plan || 'N/A' },
      {
        title: 'Policy Start Date',
        value: quote?.data.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data.insurance_additional_info?.end_date || 'N/A',
      },
    ],
    addons: addonsSectionData,
    driver: getAdditionalDriverData(quote?.data.add_named_driver_info),
    owner: [
      { title: 'Owner Name', value: `${quote?.data.personal_info?.name} ` },
      {
        title: 'Chasis number',
        value: `${quote?.data.vehicle_info_selected?.chasis_number} `,
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
      description: `${quote?.data.vehicle_info_selected?.vehicle_make} ${quote?.data.vehicle_info_selected?.vehicle_model} ${quote?.data.vehicle_info_selected?.chasis_number}`,
      icon: <NewOldReplacementIcon className='text-white' />,
    },
    {
      key: 'policy',
      title: 'Policy Plan',
      description: 'Comprehensive Plan',
      icon: <PolicyPlanIcon className='text-white' />,
    },
    {
      key: 'addons',
      title: 'Add Ons Selected',
      description: 'Additional Named Driver',
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
      title: 'Vehicle Owner',
      description: `${quote?.data.personal_info?.name}  ${quote?.data.vehicle_info_selected?.chasis_number}`,
      icon: <PersonIcon className='text-white' />,
    },
  ];

  const plan = quote?.data?.plans?.find(
    (plan) => quote.data?.selected_plan === plan.title,
  );
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
    if (isSuccess && dataPayment.payment_url) {
      router.push(dataPayment.payment_url);
    }
  }, [isSuccess, dataPayment]);

  const onPay = async () => {
    saveProposalFinalize(key);
    payment(key);
  };

  const addons = plan?.addons ?? [];

  const addonsFormatted: AddOnFormat[] = addons.map((addon) => {
    // map the icon to the addon
    const iconMatched = mapCodeTypeAddon.find(
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

  const totalAdditionFee = addonsFormatted.reduce((acc, addon) => {
    const fee = addon.feeAdded ?? 0;
    return acc + fee;
  }, 0);

  const totalFee = totalAdditionFee + (plan?.premium_with_gst ?? 0);

  const _renderPremium = () => {
    const planFee = totalFee || 0;
    const discountRate = quote?.promo_code?.discount || 0;
    const couponDiscount = planFee * (discountRate / 100);
    const gst = 35;
    const addonsSectionDataT = Object.entries(quote?.data.selected_addons || {})
      .filter(([, selectedValue]) => selectedValue !== 'NO')
      .map(([code, selectedValue]) => {
        const addon = addonsFormatted.find((a) => a.code === code);
        const value =
          addon?.options?.find((opt: any) => opt.value === selectedValue)
            ?.value || selectedValue;

        return {
          title: addon?.title || code,
          value: value,
        };
      });

    const addOnTotal = addonsSectionData.reduce((acc, addon) => {
      const value = parseFloat(addon.value.replace(/[^\d.-]/g, '')) || 0;
      return acc + value;
    }, 0);

    const netPremium = planFee - couponDiscount + addOnTotal + gst;

    return (
      <div>
        <div className='flex justify-end'>
          <div className='flex w-[150px] cursor-pointer items-center justify-center border border-[#00ADEF] py-3 font-normal'>
            Save
          </div>
        </div>
        <div className='mt-6 flex w-full flex-col gap-6 rounded-lg border border-[#E4E4E4] p-4'>
          <p className='text-center text-xl font-semibold leading-[30px] text-[#171A1F]'>
            Premium Breakdown
          </p>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2 border-b border-[#E4E4E4] px-4 py-2'>
              <div className='flex flex-row justify-between text-base leading-[30px] text-[#171A1F]'>
                <p className='mr-5 font-normal'>
                  {quote?.data?.selected_plan ?? ''}
                </p>
                <p>SGD {planFee}</p>
              </div>
              <div className='flex flex-row justify-between text-sm font-semibold text-[#00ADEF]'>
                <p>Coupon Discount</p>
                <p>-SGD {couponDiscount.toFixed(2)}</p>
              </div>
            </div>

            <div className='flex flex-col gap-2 border-b border-[#E4E4E4] px-4 py-2'>
              <p className='font-bold text-[#171A1F]'>Add-on:</p>
              {addonsSectionDataT.map((addon) => (
                <p key={addon.title} className='flex flex-row justify-between'>
                  {addon.title}: <span>SGD {addOnTotal}</span>
                </p>
              ))}
            </div>
            <div className='flex flex-col gap-2 border-b border-[#E4E4E4] px-4 py-2 text-base font-normal leading-[30px] text-[#171A1F]'>
              <div className='flex flex-row justify-between'>
                <p>Net Premium</p>
                <p>SGD {netPremium.toFixed(2)}</p>
              </div>
              <div className='flex flex-row justify-between'>
                <p>GST</p>
                <p>SGD {gst}</p>
              </div>
            </div>
            <div className='flex flex-row justify-between font-bold'>
              <p>Total (including GST)</p>
            </div>
          </div>
          <SecondaryButton
            onClick={onPay}
            loading={isPending}
            className='w-full cursor-pointer rounded-lg bg-[#00ADEF] px-4 py-3 text-center text-base font-bold leading-[21px] text-white'
          >
            Pay
          </SecondaryButton>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='px-4 py-4 md:py-16 '>
      <div className='flex w-full flex-col justify-center md:flex-row md:gap-6'>
        <div className='lg:gap-600 flex flex-col lg:flex-row'>
          <div className='flex-1'>
            <h1 className='text-center text-xl font-semibold text-[#080808] md:text-[32px] md:font-bold md:leading-[48px] md:text-[#171A1F]'>
              Review your details
            </h1>
            {sections.map((section) => {
              if (section.key === 'driver') {
                const drivers = getDriverSections(
                  quote?.data.add_named_driver_info,
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
                />
              );
            })}
          </div>
        </div>
        {isMobile ? (
          <div className='mt-2 md:px-44'>
            <PricingSummary
              fee={totalFee}
              discount={15}
              title='Premium breakdown'
              textButton='Pay'
              onClick={onPay}
            />
          </div>
        ) : (
          _renderPremium()
        )}
      </div>
    </div>
  );
}

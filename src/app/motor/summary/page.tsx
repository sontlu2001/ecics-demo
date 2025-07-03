'use client';

import { CopyOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

import { PaymentDocument } from '@/libs/types/auth';
import {
  formatBooleanToYesNo,
  formatCurrency,
  formatCurrencyString,
} from '@/libs/utils/utils';

import CheckCircle from '@/components/icons/CheckCircle';
import DocDuplicate from '@/components/icons/DocDuplicate';
import PromoTickIcon from '@/components/icons/PromoTickIcon';
import InfoCard from '@/components/page/summary/InfoCard';
import { usePaymentSummaryFromQuote } from '@/components/page/summary/useGetPaymentSummaryData';
import PremiumBreakdownContent from '@/components/PremiumBreakdownContent';
import {
  LinkButton,
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/buttons';

import { ADDON_CARS } from '@/app/motor/insurance/add-on/AddonAdditionalDriver';
import { useGetQuote, usePostZipFilesDownload } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useAppSelector } from '@/redux/store';

export default function Summary() {
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();
  const key = searchParams.get('key') || '';
  const isSingpassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  const { data: quote, isLoading } = useGetQuote(key);

  const drivers = quote?.data?.add_named_driver_info ?? [];

  const plan = quote?.data?.plans?.find(
    (plan) => quote.data?.selected_plan === plan.title,
  );

  //Call api GetPaymentSummaryData
  const productType = quote?.product_type?.name;
  const isElectric = quote?.is_electric_model;
  const { data: paymentSummaryData } = usePaymentSummaryFromQuote(
    productType,
    isElectric,
  );

  const { mutateAsync: downloadZip } = usePostZipFilesDownload();

  const _renderCongratulation = () => {
    return (
      <div className='flex flex-col items-center gap-5'>
        {isMobile ? (
          <CheckCircle size={48} />
        ) : (
          <PromoTickIcon size={48} className='text-green-promo' />
        )}
        <p className='text-center text-2xl font-normal leading-7 text-[#171A1F]'>
          Payment Success!
          <br />
          Your coverage is now active and secured.
        </p>
      </div>
    );
  };

  const _renderRewarded = () => {
    return (
      <div className='flex flex-col gap-2'>
        <p className='text-base font-semibold leading-5'>
          🎉 Get Rewarded for Referring a Friend!
        </p>
        <p className='text-sm font-normal'>
          Share your referral code with friends and you'll both get rewarded
          when they sign up.
        </p>
      </div>
    );
  };

  const _renderNews = () => {
    const section = paymentSummaryData?.[0];

    return (
      <div className='flex flex-col gap-4'>
        <div className='self-center text-xl font-semibold'>
          {section?.section_title}
        </div>

        {section?.products?.map((product: any) => (
          <div
            key={product.id}
            className='flex w-full max-w-[900px] flex-col overflow-hidden rounded-xl border shadow-md md:flex-row'
          >
            {/* Image Section */}
            <div className='aspect-video w-full md:aspect-auto md:h-auto md:w-2/5'>
              <img
                src={product.image[0]?.url}
                alt={product.name}
                className='h-full w-full object-cover'
              />
            </div>

            {/* Content Section */}
            <div className='flex w-full flex-col justify-between p-6 md:w-3/5'>
              <div>
                <h2 className='mb-2 text-xl font-semibold'>{product.name}</h2>
                <p className='mb-4 text-base font-semibold text-gray-700'>
                  {product.description}
                </p>
                <ul className='list-disc space-y-3 pl-5 text-sm font-light text-gray-600 marker:text-black'>
                  {product.features.map((feature: any) => (
                    <li key={feature.id}>
                      <div className='flex items-start gap-3'>
                        <span className='shrink-0 text-xl'>{feature.icon}</span>
                        <span className='text-sm text-gray-600'>
                          <strong className='font-semibold'>
                            {feature.description?.replace(/\.*$/, '') + ': '}
                          </strong>
                          {feature.title}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {product.button_text && (
                <div className='mt-6'>
                  <PrimaryButton
                    onClick={() =>
                      (window.location.href = product.button_link ?? '#')
                    }
                    className='rounded-lg text-sm'
                  >
                    {product.button_text}
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const _renderCashBack = () => {
    return (
      <div className='flex w-full flex-col gap-4 border border-[#00ADEF] p-4 pb-8'>
        <p className='text-[12.5px] font-semibold leading-[22px]'>
          You get $50 cash back for each friend who signs up
        </p>
        <div className='flex flex-row justify-between'>
          <SecondaryButton
            icon={<ShareAltOutlined />}
            className='h-[30px] rounded-sm text-sm !text-black shadow-md shadow-gray-200'
          >
            Share your link
          </SecondaryButton>
          <SecondaryButton
            icon={<CopyOutlined />}
            className='h-[30px] rounded-sm text-sm !text-black shadow-md shadow-gray-200'
          >
            Copy referral link
          </SecondaryButton>
        </div>
      </div>
    );
  };

  const _renderDoc = (title: string, url: string) => {
    return (
      <div
        className='flex h-full w-full cursor-pointer flex-row items-center justify-between p-2'
        onClick={() => {
          window.open(url, '_blank');
        }}
      >
        <DocDuplicate size={24} />
        <p className='ml-2 flex-1 cursor-pointer whitespace-normal break-words text-[11px] font-semibold'>
          {title}
        </p>
      </div>
    );
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

  const driversData = (quote?.data?.review_info_premium?.drivers || []).map(
    (driver: any) => [
      { label: 'Name as per NRIC', value: driver.name || 'N/A' },
      { label: 'NRIC/FIN', value: driver.nric_or_fin || 'N/A' },
      { label: 'Date of Birth', value: driver.date_of_birth || 'N/A' },
      { label: 'Gender', value: driver.gender || 'N/A' },
      { label: 'Marital Status', value: driver.marital_status || 'N/A' },
      {
        label: 'Driving Experience',
        value: driver.driving_experience
          ? `${driver.driving_experience} years`
          : 'N/A',
      },
      {
        label: 'Do you have a claim in the past 3 years',
        value: formatBooleanToYesNo(driver.is_claim_in_3_years) || 'N/A',
      },
    ],
  );

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }
  const documents: PaymentDocument[] = paymentSummaryData?.[0]?.documents || [];

  const handleDownloadAll = async () => {
    try {
      const fileUrls = documents.flatMap((doc) =>
        doc.document.map((d) => d.url),
      );
      if (fileUrls.length === 0) {
        console.warn('No documents to download');
        return;
      }

      const blob = await downloadZip(fileUrls);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ECICS-documents.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
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

  return (
    <div className='flex w-full justify-center '>
      <div className='w-full max-w-[1280px]'>
        <div className='flex w-full flex-col items-center justify-center gap-6 px-6 py-4'>
          {_renderCongratulation()}
          <p className='text-[15px] font-normal leading-5 text-[#9f9f9f]'>
            A confirmation email with your policy document has been sent to your
            registered email address.
          </p>
          <div className='w-full bg-[#FAFAFA] p-4 md:max-w-[334px]'>
            <p className='mb-2 text-center text-base font-semibold leading-5'>
              All set! Your document is ready to go.
            </p>
            <div className='grid'>
              {documents.map((doc: any, index: number) => (
                <div key={index}>
                  {_renderDoc(doc.text, doc.document?.[0]?.url)}
                </div>
              ))}
            </div>
            <div className='flex justify-center'>
              <LinkButton
                type='link'
                className='text-sm font-semibold text-[#00ADEF]'
                onClick={handleDownloadAll}
              >
                Download All
              </LinkButton>
            </div>
          </div>
          <div className='text-xl font-semibold'>Your Policy Summary</div>
          <div className='flex w-full flex-col items-center justify-center gap-6 md:max-w-[800px]'>
            <InfoCard
              title='Policy Details'
              data={[
                {
                  label: 'Selected Plan',
                  value: selectedPlanTitle,
                },
                {
                  label: 'Policy Start Date',
                  value:
                    quote?.data?.insurance_additional_info?.start_date || 'N/A',
                },
                {
                  label: 'Policy End Date',
                  value:
                    quote?.data?.insurance_additional_info?.end_date || 'N/A',
                },
                {
                  label: 'Plan Details',
                  value:
                    addonsTitles.length > 0 ? addonsTitles.join(', ') : 'N/A',
                },
                {
                  label: 'Add-ons',
                  value:
                    addonsSectionData.length === 0 &&
                    addonsIncludedData.length === 0 &&
                    filteredAddonsAdditionalDriver.length === 0
                      ? [{ title: 'You have no Add Ons selected', value: '' }]
                      : [
                          ...addonsSectionData,
                          ...addonsIncludedData,
                          ...filteredAddonsAdditionalDriver,
                        ],
                },
              ]}
              extraData={
                <PremiumBreakdownContent
                  isSummaryScreen={true}
                  quoteInfo={quote}
                  dataSelectedAddOn={
                    quote?.data?.review_info_premium?.data_section_add_ons
                  }
                  drivers={quote?.data?.review_info_premium?.drivers ?? []}
                  addonAdditionalDriver={
                    quote?.data?.review_info_premium?.addon_additional_driver
                  }
                  pricePlanMain={
                    quote?.data?.review_info_premium?.price_plan ?? 0
                  }
                  couponDiscount={
                    quote?.data?.review_info_premium?.coupon_discount ?? 0
                  }
                  tax={1.09}
                  gst={quote?.data?.review_info_premium?.gst ?? 0}
                  netPremium={
                    quote?.data?.review_info_premium?.net_premium ?? 0
                  }
                  addonsIncluded={
                    quote?.data?.review_info_premium
                      ?.add_ons_included_in_this_plan
                  }
                />
              }
            />
            <InfoCard
              title='Vehicle Details'
              data={[
                {
                  label: 'Vehicle Number',
                  value:
                    quote?.data?.vehicle_info_selected?.vehicle_number || 'N/A',
                },
                {
                  label: 'Vehicle Make',
                  value:
                    quote?.data?.vehicle_info_selected?.vehicle_make || 'N/A',
                },
                {
                  label: 'Vehicle Model',
                  value:
                    quote?.data?.vehicle_info_selected?.vehicle_model || 'N/A',
                },
                {
                  label: 'First Registration Date',
                  value:
                    quote?.data?.vehicle_info_selected?.first_registered_year ||
                    'N/A',
                },
                ...(isSingpassFlow
                  ? [
                      {
                        label: 'Years of Manufacture',
                        value:
                          quote?.data?.vehicle_info_selected
                            ?.year_of_manufacture || 'N/A',
                      },
                    ]
                  : []),
                {
                  label: 'Engine Number',
                  value:
                    quote?.data?.vehicle_info_selected?.engine_number || 'N/A',
                },
                {
                  label: 'Chassis Number',
                  value:
                    quote?.data?.vehicle_info_selected?.chasis_number || 'N/A',
                },
                ...(isSingpassFlow
                  ? [
                      {
                        label: 'Engine Capacity',
                        value:
                          quote?.data?.vehicle_info_selected?.engine_capacity ||
                          'N/A',
                      },
                      {
                        label: 'Power Rate',
                        value:
                          quote?.data?.vehicle_info_selected?.power_rate ||
                          'N/A',
                      },
                    ]
                  : []),
              ]}
            />
            <InfoCard
              title='Insured Info'
              data={[
                {
                  label: 'Name as per NRIC',
                  value: quote?.data?.personal_info?.name || 'N/A',
                },
                {
                  label: 'NRIC / FIN',
                  value: quote?.data?.personal_info?.nric || 'N/A',
                },
                {
                  label: 'Gender',
                  value: quote?.data?.personal_info?.gender || 'N/A',
                },
                {
                  label: 'Marital Status',
                  value: quote?.data?.personal_info?.marital_status || 'N/A',
                },
                {
                  label: 'Date of Birth',
                  value: quote?.data?.personal_info?.date_of_birth || 'N/A',
                },
                {
                  label: 'Address Line 1',
                  value: quote?.data?.personal_info?.address?.[0] ?? 'N/A',
                },
                {
                  label: 'Address Line 2',
                  value: quote?.data?.personal_info?.address?.[1]
                    ? quote?.data?.personal_info?.address?.[1]
                    : 'N/A',
                },
                {
                  label: 'Address Line 3',
                  value: quote?.data?.personal_info?.address?.[2]
                    ? quote?.data?.personal_info?.address?.[2]
                    : 'N/A',
                },
                {
                  label: 'Postal Code',
                  value: quote?.data?.personal_info?.post_code || 'N/A',
                },
                {
                  label: 'Email',
                  value: quote?.data?.personal_info?.email || 'N/A',
                },
                {
                  label: 'Mobile Number',
                  value: quote?.data?.personal_info?.phone || 'N/A',
                },
              ]}
            />
            {driversData.map((driver, index) => (
              <InfoCard
                key={index}
                title={`Additional Named Driver ${index + 1}`}
                data={driver}
              />
            ))}
          </div>
          {_renderNews()}
          {/* {_renderRewarded()}
                      {_renderRewarded()}
                      {_renderCashBack()} */}

          {/*{isMobile ? (*/}
          {/*    <div className='flex justify-center gap-4 bg-white pt-4 text-[16px]'>*/}
          {/*        <LinkButton*/}
          {/*            type='link'*/}
          {/*            className='font-bold text-[#00ADEF]'*/}
          {/*            onClick={handleGoPersonal}*/}
          {/*        >*/}
          {/*            Find out more about our other products!*/}
          {/*        </LinkButton>*/}
          {/*    </div>*/}
          {/*) : (*/}
          {/*    <PrimaryButton*/}
          {/*        className='w-full font-bold md:max-w-[800px]'*/}
          {/*        onClick={handleGoPersonal}*/}
          {/*    >*/}
          {/*        Find out more about our other products!*/}
          {/*    </PrimaryButton>*/}
          {/*)}*/}
        </div>
      </div>
    </div>
  );
}

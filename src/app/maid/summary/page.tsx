'use client';

import { Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { PaymentDocument } from '@/libs/types/auth';
import { formatCurrency, formatCurrencyString } from '@/libs/utils/utils';

import CheckCircle from '@/components/icons/CheckCircle';
import DocDuplicate from '@/components/icons/DocDuplicate';
import PromoTickIcon from '@/components/icons/PromoTickIcon';
import InfoCard from '@/components/page/summary/InfoCard';
import { usePaymentSummaryFromQuote } from '@/components/page/summary/useGetPaymentSummaryData';
import PremiumBreakdownContent from '@/components/PremiumBreakdownContent';
import { LinkButton, PrimaryButton } from '@/components/ui/buttons';

import { useGetQuote, usePostZipFilesDownload } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

export default function Summary() {
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();
  const key = searchParams.get('key') || '';

  const { data: quote, isLoading } = useGetQuote(key);

  //Call api GetPaymentSummaryData
  const productType = quote?.product_type?.name;
  const { data: paymentSummaryData } = usePaymentSummaryFromQuote(productType);

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
            <div className='h-[250px] w-full md:h-auto md:w-2/5'>
              <img
                src={product.image?.[0]?.url}
                alt={product.name}
                className='h-full w-full rounded-t-xl object-cover md:rounded-l-xl md:rounded-t-none'
              />
            </div>

            {/* Content Section */}
            <div className='flex w-full flex-col justify-between p-6 md:w-3/5'>
              <div>
                <h2 className='mb-2 text-center text-xl font-semibold md:text-left'>
                  {product.name}
                </h2>
                <p className='mb-4 text-center text-base font-semibold text-gray-700 md:text-left'>
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
  const addonsTitles = matchedPlan?.benefits || [];

  return (
    <div className='flex h-screen w-full justify-center overflow-y-auto'>
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
                  value: quote?.data?.insurance_other_info?.start_date || 'N/A',
                },
                {
                  label: 'Policy End Date',
                  value: quote?.data?.insurance_other_info?.end_date || 'N/A',
                },
                {
                  label: 'Plan Details',
                  value:
                    addonsTitles.length > 0 ? addonsTitles.join(', ') : 'N/A',
                },
                {
                  label: 'Add-ons',
                  value: [...addonsSectionData, ...addonsIncludedData],
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
              title='Helper’s Details'
              data={[
                {
                  label: 'Helper Type',
                  value: quote?.data?.insurance_other_info?.maid_type || 'N/A',
                },
                {
                  label: 'Nationality',
                  value: quote?.data?.maid_info?.nationality || 'N/A',
                },
                {
                  label: 'Date of Birth',
                  value: quote?.data?.maid_info?.date_of_birth || 'N/A',
                },
                {
                  label: 'Full Name',
                  value: quote?.data?.maid_info?.name || 'N/A',
                },
                {
                  label: 'FIN',
                  value: quote?.data?.maid_info?.fin || 'N/A',
                },
                {
                  label: 'Passport Number',
                  value: quote?.data?.maid_info?.passport_number || 'N/A',
                },
                {
                  label:
                    'Has the helper been employed by you for more than 12 months?',
                  value:
                    quote?.data?.maid_info?.has_helper_worked_12_months ||
                    'N/A',
                },
                {
                  label: 'Previous Insurer Name',
                  value: quote?.data?.maid_info?.company_name || 'N/A',
                },
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
                  label: 'Date of Birth',
                  value: quote?.data?.personal_info?.date_of_birth || 'N/A',
                },
                {
                  label: 'NRIC / FIN',
                  value: quote?.data?.personal_info?.nric || 'N/A',
                },
                {
                  label: 'Nationality',
                  value: quote?.data?.personal_info?.nationality || 'N/A',
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
                  label: 'Mobile Number',
                  value: quote?.data?.personal_info?.phone || 'N/A',
                },
                {
                  label: 'Email',
                  value: quote?.data?.personal_info?.email || 'N/A',
                },
              ]}
            />
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

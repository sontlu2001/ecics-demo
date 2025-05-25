'use client';

import {
  ArrowRightOutlined,
  CopyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Spin } from 'antd';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import CheckCircle from '@/components/icons/CheckCircle';
import DocDuplicate from '@/components/icons/DocDuplicate';
import {
  LinkButton,
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';
import { useGetQuote } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';

import InfoCard from './InfoCard';

export default function Summary() {
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();
  const key = searchParams.get('key') || '';
  const router = useRouterWithQuery();

  const handleGoPersonal = () => {
    window.open(
      'https://www.ecics.com/product-listing/personal',
      '_blank',
      'noopener,noreferrer',
    );
  };

  const { data: quote, isLoading } = useGetQuote(key);

  const _renderCongratulation = () => {
    return (
      <div className='flex flex-col items-center gap-5'>
        <CheckCircle size={48} />
        <p className='text-base font-semibold leading-5 text-[#171A1F]'>
          Congratulations! Your policy has been successfully purchased 🎉
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
      <div className='flex h-full min-h-[150px] w-full flex-col items-start justify-between rounded border border-[#00ADEF] p-2'>
        <DocDuplicate size={24} />
        <p className='w-full cursor-pointer whitespace-normal break-words text-[11px] font-semibold'>
          {title}
        </p>
        <div
          className='flex cursor-pointer flex-row gap-2 text-[10px] font-semibold text-[#00ADEF]'
          onClick={() => {
            window.open(url, '_blank');
          }}
        >
          Read More <ArrowRightOutlined />
        </div>
      </div>
    );
  };

  const addonsSectionData = (
    quote?.data?.review_info_premium?.data_section_add_ons || []
  ).map((addon: any) => ({
    title: addon.title,
    value: addon.optionLabel,
  }));
  const AddOnIncludedInPlan =
    quote?.data?.review_info_premium?.add_ons_included_in_this_plan;

  const driversData = (quote?.data?.review_info_premium?.drivers || []).map(
    (driver: any) => [
      { label: 'Name', value: driver.name || 'N/A' },
      { label: 'Gender', value: driver.gender || 'N/A' },
      { label: 'NRIC/FIN', value: driver.nric_or_fin || 'N/A' },
      { label: 'Date of Birth', value: driver.date_of_birth || 'N/A' },
      { label: 'Marital Status', value: driver.marital_status || 'N/A' },
    ],
  );

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='flex w-full justify-center '>
      <div className='w-full max-w-[1280px]'>
        <div className='flex w-full flex-col items-center justify-center gap-6 px-6 py-4'>
          {_renderCongratulation()}
          <p className='text-[15px] font-normal leading-5'>
            A confirmation email with the policy details has been sent to your
            registered email.
          </p>
          <div className='flex w-full flex-col items-center justify-center gap-6 md:max-w-[800px]'>
            <InfoCard
              title='Policy Details'
              data={[
                {
                  label: 'Plan Type',
                  value: quote?.data?.selected_plan || 'N/A',
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
              ]}
              extraTitle='Add Ons:'
              extraData={addonsSectionData}
              addOnIncludedInPlan={AddOnIncludedInPlan}
              drivers={quote?.data?.review_info_premium?.drivers}
            />
            <InfoCard
              title='Insured Info'
              data={[
                {
                  label: 'Name',
                  value: quote?.data?.personal_info?.name || 'N/A',
                },
                {
                  label: 'Mobile Number',
                  value: quote?.data?.personal_info?.phone || 'N/A',
                },
                {
                  label: 'Email',
                  value: quote?.data?.personal_info?.email || 'N/A',
                },
                {
                  label: 'Address',
                  value: quote?.data?.personal_info?.address[0] || 'N/A',
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
          {/* {_renderRewarded()}
          {_renderRewarded()}
          {_renderCashBack()} */}

          <div className='w-full md:max-w-[800px]'>
            <p className='mb-2 text-base font-semibold leading-5'>
              Documents Download
            </p>
            <div className='grid grid-cols-2 items-stretch gap-4 md:grid-cols-3'>
              {quote?.product_type.documents?.map((doc: any, index: number) => (
                <div key={index}>{_renderDoc(doc.title, doc.link)}</div>
              ))}
            </div>
          </div>
          {isMobile ? (
            <div className='flex justify-center gap-4 bg-white pt-4 text-[16px]'>
              <LinkButton
                type='link'
                className='font-bold text-[#00ADEF]'
                onClick={handleGoPersonal}
              >
                Find out more about our other products!
              </LinkButton>
            </div>
          ) : (
            <PrimaryButton
              className='w-full font-bold md:max-w-[800px]'
              onClick={handleGoPersonal}
            >
              Find out more about our other products!
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

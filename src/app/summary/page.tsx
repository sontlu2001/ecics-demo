'use client';
import {
  ArrowRightOutlined,
  CopyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { SecondaryButton } from '@/components/ui/buttons';
import InfoCard from './InfoCard';
import CheckCircle from '@/components/icons/CheckCircle';
import DocDuplicate from '@/components/icons/DocDuplicate';
import { useGetQuote } from '@/hook/insurance/quote';
import React from 'react';

export default function Summary() {
  const { data: quote } = useGetQuote('1745750192188');

  const _renderCongratulation = () => {
    return (
      <div className='flex flex-row items-center gap-5'>
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

  const _renderDoc = (title: string) => {
    return (
      <div className='flex min-h-[126px]'>
        <div className='flex flex-col justify-between border border-[#00ADEF] px-2 py-2'>
          <div>
            {' '}
            <DocDuplicate size={24} />
          </div>
          <p className='text-[11px] font-semibold'>{title}</p>
          <div className='flex flex-row gap-2 text-[10px] font-semibold text-[#00ADEF]'>
            Read More <ArrowRightOutlined />
          </div>
        </div>
      </div>
    );
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

  return (
    <div className='flex w-full flex-col items-center justify-center gap-6 px-6 py-4'>
      {_renderCongratulation()}
      <p className='text-[15px] font-normal leading-5'>
        A confirmation email with the policy details has been sent to your
        registered email.
      </p>
      <InfoCard
        title='Policy Details'
        data={[
          {
            label: 'Plan Type',
            value: quote?.data.selected_plan || 'N/A',
          },
          {
            label: 'Policy Start Date',
            value: quote?.data.insurance_additional_info?.start_date || 'N/A',
          },
          {
            label: 'Policy End Date',
            value: quote?.data.insurance_additional_info?.end_date || 'N/A',
          },
        ]}
        extraTitle='Add Ons:'
        extraData={addonsSectionData}
      />
      <InfoCard
        title='Insured Info'
        data={[
          { label: 'Name', value: quote?.data.personal_info?.name || 'N/A' },
          {
            label: 'Mobile Number',
            value: quote?.data.personal_info?.phone || 'N/A',
          },
          { label: 'Email', value: quote?.data.personal_info?.email || 'N/A' },
          {
            label: 'Address',
            value: quote?.data.personal_info?.address[0] || 'N/A',
          },
        ]}
      />
      {_renderRewarded()}
      {/* {_renderRewarded()}
>>>>>>> development
      {_renderCashBack()}
      <div>
        <p className='mb-2 text-base font-semibold leading-5'>
          Documents Download
        </p>
        <div className='flex flex-row justify-between gap-2'>
          {_renderDoc('Authorized Workshop Plan')}
          {_renderDoc('Private Car Policy Wording')}
        </div>
      </div> */}
    </div>
  );
}

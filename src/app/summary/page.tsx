import Image from 'next/image';
import {
  ArrowRightOutlined,
  CopyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { SecondaryButton } from '@/components/ui/buttons';
import InfoCard from './InfoCard';
import CheckCircle from '@/components/icons/CheckCircle';
import DocDuplicate from '@/components/icons/DocDuplicate';

export default function Summary() {
  const _renderCongratulation = () => {
    return (
      <div className='flex flex-row gap-5'>
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
          Share your referral code with friends and you both get rewarded
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

  return (
    <div className='flex w-full flex-col gap-6 px-6 py-4'>
      {_renderCongratulation()}
      <p className='text-[15px] font-normal leading-5'>
        A confirmation email with the policy details has been sent to your
        registered email.
      </p>
      <InfoCard
        title='Policy Details'
        data={[
          { label: 'Plan Type', value: 'Comprehensive' },
          { label: 'Policy Start Date', value: '15/12/2025' },
          { label: 'Policy End Date', value: '15/12/2026' },
          { label: 'Loss of Use', value: 'Transport Allowance' },
          { label: 'Personal Accident+', value: '+S$30,000' },
        ]}
        extraTitle='Add Ons:'
      />

      <InfoCard
        title='Insured Info'
        data={[
          { label: 'Name', value: 'Rahul Shah' },
          { label: 'Mobile Number', value: '+65 9887506' },
          { label: 'Email', value: 'sayangmail.com' },
          {
            label: 'Address',
            value: '#10 Eunos Road Building 2 Singapore 400071',
          },
        ]}
      />
      {_renderRewarded()}
      {_renderCashBack()}
      <div>
        <p className='mb-2 text-base font-semibold leading-5'>
          Documents Download
        </p>
        <div className='flex flex-row justify-between gap-2'>
          {_renderDoc('Authorized Workshop Plan')}
          {_renderDoc('Private Car Policy Wording')}
        </div>
      </div>
    </div>
  );
}

'use client';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';

import ProcessBar from '@/components/ProcessBar';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex h-full w-full flex-col items-center justify-center'>
        <Image src='/ecics-50-years.svg' alt='Logo' width={260} height={72} />
        <h1 className='text-3xl font-bold'>Welcome to the ECICS</h1>
        <div className='flex flex-col gap-4'>
          <div className='flex w-96 gap-4'>
            <SecondaryButton className='w-full'>Secondary</SecondaryButton>
            <PrimaryButton className='w-full'>Primary</PrimaryButton>
          </div>
          <SecondaryButton
            size='large'
            className='font-[400]'
            icon={<span>+</span>}
          >
            Add more drive
          </SecondaryButton>
        </div>
      </div>
      <div className=''>
        <ProcessBar currentStep={1} />
      </div>
    </main>
  );
}

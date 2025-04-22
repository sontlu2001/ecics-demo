'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex h-full w-full flex-col items-center justify-center'>
        <Image src='/ecics-50-years.svg' alt='Logo' width={260} height={72} />
        <h1 className='text-3xl font-bold'>Welcome to the ECICS</h1>
        <div className='flex flex-col gap-4'>
          <div className='flex w-96 gap-4'>
          </div>

        </div>
      </div>
    </main>
  );
}

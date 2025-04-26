'use client';

import { Select } from 'antd';
import { useState } from 'react';

import { SecondaryButton } from '@/components/ui/buttons';

import AddOnRow, { Status } from './AddOnRow';

export interface AddOnRowData {
  title: string;
  icon: React.ReactNode;
}

export default function AddOnRowDetail({
  title,
  icon,
  isRecommended = false,
}: {
  title: string;
  icon: React.ReactNode;
  isRecommended?: boolean;
}) {
  const [status, setStatus] = useState<Status>('new');
  return (
    <AddOnRow
      isRecommended={isRecommended}
      title={title}
      icon={icon}
      status={status}
    >
      {status === 'new' && (
        <>
          <p className='font-medium'>
            Get reimbursed for replacing your car keys if they’re lost due to
            theft, robbery, or an accident.
          </p>
          <hr className=' my-2 bg-sky-500' />
          <div className='flex items-center justify-between'>
            <p>Select Coverage Amount</p>
            <Select
              defaultValue='SGD 500'
              style={{ width: 120 }}
              className='w-28'
              options={[
                { value: 'jack', label: 'SGD 500' },
                { value: 'lucy', label: 'SGD 500' },
                { value: 'Yiminghe', label: 'SGD 500' },
              ]}
            />
          </div>
          <div className='flex items-center justify-between pt-2'>
            <p>SGD 43</p>
            <SecondaryButton
              className='h-8 w-28 rounded-md py-0 leading-4 text-black'
              onClick={() => setStatus('completed')}
            >
              Add
            </SecondaryButton>
          </div>
        </>
      )}
      {status === 'completed' && (
        <>
          <p className='font-medium'>
            Get reimbursed for replacing your car keys if they’re lost due to
            theft, robbery, or an accident.
          </p>
          <hr className=' my-2 bg-sky-500' />
          <div className='flex items-center justify-between pt-2'>
            <p>SGD 43</p>
            <SecondaryButton
              className='h-8 w-28 rounded-md py-0 leading-4 text-red-500'
              onClick={() => setStatus('new')}
            >
              Remove
            </SecondaryButton>
          </div>
        </>
      )}
    </AddOnRow>
  );
}

import { Button } from 'antd';

import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { SecondaryButton } from '@/components/ui/buttons';

interface BusinessPartnerBarProps {
  businessName?: string;
  companyName?: string;
  onBackClick?: () => void;
  onSaveClick?: () => void;
}

export default function BusinessPartnerBar({
  businessName,
  companyName,
  onBackClick,
  onSaveClick,
}: BusinessPartnerBarProps) {
  return (
    <div className='flex w-full items-center justify-between px-3 py-2 shadow-md shadow-gray-300'>
      <div className='flex gap-4'>
        <Button
          color='cyan'
          icon={<ArrowBackIcon size={16} />}
          shape='circle'
          className='border-none bg-gray-200 pt-[6px]'
          onClick={onBackClick}
        />
        <div className='text-xs'>
          {businessName && <p>{businessName}</p>}
          {companyName && <p className='font-bold'>{companyName}</p>}
        </div>
      </div>
      <div></div>
      {/* Reopen in Day 1.5 */}
      {/* <SecondaryButton
        size='small'
        className='rounded-sm px-2'
        onClick={onSaveClick}
      >
        Save
      </SecondaryButton> */}
    </div>
  );
}

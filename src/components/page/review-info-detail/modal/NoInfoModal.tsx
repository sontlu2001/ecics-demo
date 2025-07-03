import { Drawer, Modal } from 'antd';
import React from 'react';

import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface NoInfoModalProps {
  title?: string;
  onExit: () => void;
  onContinue: () => void;
  description: string;
}

export const NoInfoModal = ({
  onExit,
  onContinue,
  title,
  description,
}: NoInfoModalProps) => {
  const { isMobile } = useDeviceDetection();

  const content = (
    <>
      <div className='flex flex-col gap-2'>
        <WarningTriangleIcon size={70} />
        <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
          {title}
        </p>
        <div className='flex flex-col items-center gap-6 text-center text-[#00000073]'>
          <p className='text-sm font-normal'>
            Based on the details retrieved from MyInfo via Singpass, we were{' '}
            <strong>{description}</strong>
          </p>
          <p>
            If you wish to get a quote, you’ll need to manually fill in your
            personal information and vehicle details.
          </p>
          <p>
            If you're okay with this, please click the “Continue” button below
            to proceed. Otherwise, you may exit the page.
          </p>
        </div>
        <div className='mt-[10px] flex flex-row items-center justify-between'>
          <SecondaryButton
            className={`${
              isMobile
                ? 'w-full'
                : 'w-[10vw] min-w-[150px] px-4 py-2 md:w-[10vw]'
            }`}
            danger
            onClick={onExit}
          >
            Exit
          </SecondaryButton>
          <PrimaryButton
            className={`${isMobile ? 'w-full' : 'ml-[6px] md:w-40'} bg-brand-blue`}
            onClick={onContinue}
          >
            Continue
          </PrimaryButton>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        onClose={onContinue}
        closable={false}
        height='auto'
        className='rounded-t-xl'
      >
        <div>{content}</div>
      </Drawer>
    );
  }

  return (
    <Modal
      onOk={onContinue}
      onCancel={onContinue}
      closable={false}
      maskClosable={true}
      keyboard={true}
      footer={null}
      centered
      width={400}
    >
      <div>{content}</div>
    </Modal>
  );
};

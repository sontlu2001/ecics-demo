import { Drawer, Modal } from 'antd';
import React from 'react';

import MailIcon from '@/components/icons/MailIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface QuoteModalProps {
  visible: boolean;
  onClick: () => void;
  description: string;
}

export const QuoteModal = ({
  onClick,
  visible,
  description,
}: QuoteModalProps) => {
  const { isMobile } = useDeviceDetection();

  const content = (
    <>
      <div className='flex flex-col gap-2'>
        <WarningTriangleIcon size={70} />
        <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
          Need Help with Your Quote?
        </p>
        <div className='flex flex-col items-center gap-6 text-center text-[#00000073]'>
          <p className='text-sm font-normal'>
            We're currently unable to generate an online quote for you due to
            the following reasons:
          </p>
          <ul className='list-inside list-disc'>
            <li
              className='font-bold underline'
              style={{ listStyleType: 'disc' }}
            >
              {description}
            </li>
          </ul>
          <p>
            However, you may still be eligible for coverage. We encourage you to
            contact our support team for further assistance. Our team will be
            happy to provide a personalized quote tailored to your needs.
          </p>
          <p>
            Thank you for your patience and understanding — we look forward to
            helping you.
          </p>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <a
            href='tel:+6562065588'
            className='flex w-[150px] flex-row items-center justify-center gap-1 rounded-lg bg-green-promo py-3 text-base font-normal text-white hover:opacity-90'
          >
            <PhoneIcon
              className='relative top-[1px] mr-1 text-white'
              size={15}
            />
            Call
          </a>
          <a
            href='mailto:customerservice@ecics.com.sg'
            target='_blank'
            rel='noopener noreferrer'
            className='flex w-[150px] flex-row items-center justify-center gap-1 rounded-lg bg-[#00ADEF] py-3 text-base font-normal text-white hover:opacity-90'
          >
            <MailIcon
              className='relative top-[1px] mr-1 text-white'
              size={15}
            />
            Email
          </a>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={onClick}
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
      open={visible}
      onOk={onClick}
      onCancel={onClick}
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

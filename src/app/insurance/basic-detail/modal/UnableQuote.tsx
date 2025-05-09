import { Drawer, Modal } from 'antd';
import React from 'react';
import { PrimaryButton } from '@/components/ui/buttons';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface UnableQuoteModalProps {
  visible: boolean;
  onClick: () => void;
}

export const UnableQuote = ({ onClick, visible }: UnableQuoteModalProps) => {
  const { isMobile } = useDeviceDetection();

  const content = (
    <>
      <div className='flex flex-col items-center text-center'>
        <div className='mb-9 break-words text-lg font-semibold leading-none'>
          We are unable to provide you a quote at the moment.
        </div>
        <div className='mb-6 break-words text-base leading-none'>
          Please contact us for assistance
        </div>
        <div className='mb-6 flex items-center justify-center break-words text-base font-semibold leading-none underline'>
          <PhoneOutlined className='relative top-[1px] mr-1 text-2xl text-brand-blue' />
          +65 6206 5588
        </div>
        <div className='mb-9 flex items-center justify-center break-words text-base font-semibold leading-none underline'>
          <MailOutlined className='relative top-[1px] mr-1 text-2xl text-brand-blue' />
          customerservice@ecics.com.sg
        </div>
      </div>

      <PrimaryButton onClick={onClick} className='w-full'>
        Okay
      </PrimaryButton>
    </>
  );

  // Return Drawer on mobile
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

  // Return Modal on desktop
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
    >
      <div>{content}</div>
    </Modal>
  );
};

import { Drawer, Modal } from 'antd';

import { PrimaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface UnableQuoteModalProps {
  visible: boolean;
  onOk: () => void;
}

export const RequiredModal = ({ visible, onOk }: UnableQuoteModalProps) => {
  const { isMobile } = useDeviceDetection();

  const content = (
    <>
      <div className='flex flex-col items-center pb-10 text-center'>
        <div className='my-6 break-words text-lg font-semibold leading-none'>
          Minimum one additional required to be added for Comprehensive Family
          NCD Builder Plan.
        </div>
      </div>
      <div className='flex gap-3'>
        <PrimaryButton onClick={onOk} className='w-full'>
          Okay
        </PrimaryButton>
      </div>
    </>
  );

  // Return Drawer on mobile
  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={onOk}
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
      onOk={onOk}
      onCancel={onOk}
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

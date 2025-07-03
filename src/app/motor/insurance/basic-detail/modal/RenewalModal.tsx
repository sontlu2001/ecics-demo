import { Drawer, Modal } from 'antd';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface UnableQuoteModalProps {
  visible: boolean;
  onCancel: () => void;
  onRenew: () => void;
}

export const RenewalModal = ({
  visible,
  onCancel,
  onRenew,
}: UnableQuoteModalProps) => {
  const { isMobile } = useDeviceDetection();

  const content = (
    <>
      <div className='flex flex-col items-center pb-10 text-center'>
        <div className='mb-9 break-words text-lg font-semibold leading-none'>
          You have a Renewal with us.
        </div>
        <div className='mb-6 break-words text-base leading-none'>
          Click ‘Renew’ button to renew
        </div>
        <div className='mb-6 break-words text-base leading-none'>
          your current policy
        </div>
      </div>
      <div className='flex gap-3 md:gap-6'>
        <SecondaryButton onClick={onCancel} className='w-full'>
          Cancel
        </SecondaryButton>
        <PrimaryButton onClick={onRenew} className='w-full'>
          Renew
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
        onClose={onCancel}
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
      onOk={onRenew}
      onCancel={onCancel}
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

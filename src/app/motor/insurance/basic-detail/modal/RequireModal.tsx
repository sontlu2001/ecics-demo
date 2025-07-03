import { Drawer, Modal } from 'antd';

import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
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
      <div className='flex flex-col items-center justify-center gap-4'>
        <div>
          <WarningTriangleIcon size={70} />
        </div>
        <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
          Missing Additional Driver Information
        </p>
        <div className='flex flex-col gap-7 text-center text-sm font-normal leading-[22px] text-[#00000073]'>
          <p>
            It looks like you haven't filled in the{' '}
            <span className='font-semibold underline'>
              details for the additional driver
            </span>{' '}
            included in your Comprehensive - Family NCD Builder plan.
          </p>
          <p>
            To ensure your policy is complete and valid, please provide the
            required information before proceeding
          </p>
        </div>
        <PrimaryButton onClick={onOk} className='w-full'>
          Fill up Additional Driver
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

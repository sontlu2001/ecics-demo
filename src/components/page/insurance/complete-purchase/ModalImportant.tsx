import { Drawer, Modal } from 'antd';

import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface Props {
  isShowPopupImportant: boolean;
  handleRedirect: () => void;
  setIsShowPopupImportant: (isShowPopupImportant: boolean) => void;
}

const ModalImportant = (props: Props) => {
  const { isShowPopupImportant, handleRedirect, setIsShowPopupImportant } =
    props;

  const { isMobile } = useDeviceDetection();
  const modalContent = (
    <div className='flex h-full flex-col justify-between md:p-4'>
      <WarningTriangleIcon size={70} />
      <p className='text-center text-2xl font-normal leading-[32px]'>
        Are you sure you want to go back?
      </p>
      <div className='mt-2 flex flex-col gap-4 text-center text-sm font-normal leading-[22px] text-[#00000073]'>
        <p>
          You are about to return to a previous step. Please note that modifying
          any information may affect your quote, and a new quote will be
          generated based on the updated details.
        </p>
        <p>Do you wish to proceed?</p>
      </div>
      <div className='mt-6 flex w-full flex-row justify-between gap-2'>
        <SecondaryButton
          className='max-w-[150px] flex-1 rounded-none border border-[#262626] py-6 text-[#262626] md:py-6'
          onClick={() => setIsShowPopupImportant(false)}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={handleRedirect}
          className='max-w-[150px] flex-1 py-6 text-white md:py-6'
        >
          Proceed
        </PrimaryButton>
      </div>
    </div>
  );

  return isMobile ? (
    <Drawer
      placement='bottom'
      open={isShowPopupImportant}
      closable={false}
      height='auto'
      className='rounded-t-xl'
    >
      {modalContent}
    </Drawer>
  ) : (
    <Modal
      open={isShowPopupImportant}
      closable={false}
      footer={null}
      centered
      onCancel={() => setIsShowPopupImportant(false)}
    >
      {modalContent}
    </Modal>
  );
};

export default ModalImportant;

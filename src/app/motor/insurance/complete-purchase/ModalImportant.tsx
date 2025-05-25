import { Drawer, Modal } from 'antd';

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
      <div className='mb-2 w-full text-center text-[16px] font-normal leading-[25px] text-[#000000] md:mb-10 md:text-[24px] md:font-semibold md:leading-[30px] md:text-[#171A1F]'>
        Important Notice: Quote Recalculation
      </div>

      <div className='mt-2 rounded-lg bg-[#81899414] px-2 py-4 text-center text-[15px] font-[300] leading-[25px] text-[#000000]'>
        Please note that any changes to these details will impact your quote,
        and a new quote will be generated accordingly.
      </div>

      <div className='mt-6 flex w-full flex-col justify-center gap-2'>
        <PrimaryButton
          onClick={handleRedirect}
          className='flex-1 py-2 text-white md:py-4'
        >
          Proceed
        </PrimaryButton>
        <SecondaryButton
          className='flex-1 py-2 md:py-3'
          onClick={() => setIsShowPopupImportant(false)}
        >
          Cancel
        </SecondaryButton>
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

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { Drawer, Modal } from 'antd';

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
    <div className='flex h-full flex-col justify-between p-4'>
      <div className='mb-10 w-full text-center text-[16px] font-normal leading-[25px] text-[#000000] md:mb-2 md:text-[24px] md:font-semibold md:leading-[30px] md:text-[#171A1F]'>
        Important Notice: Quote Recalculation
      </div>

      {!isMobile && (
        <div className='mt-2 rounded-lg bg-[#81899414] px-2 py-4 text-center text-[15px] font-[300] leading-[25px] text-[#000000]'>
          Please note that any changes to these details will impact your quote,
          and a new quote will be generated accordingly.
        </div>
      )}

      <div className='mt-6 flex w-full justify-center gap-4 md:flex-col'>
        <SecondaryButton
          className='flex-1 md:py-4'
          onClick={() => setIsShowPopupImportant(false)}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={handleRedirect}
          className='flex-1 text-white md:py-5'
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

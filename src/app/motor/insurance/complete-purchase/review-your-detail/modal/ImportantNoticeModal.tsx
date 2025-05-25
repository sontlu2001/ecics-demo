import { Drawer, Modal } from 'antd';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface Props {
  onSave: () => void;
  setIsShowRecalculation: (IsShowRecalculation: boolean) => void;
  IsShowRecalculation: boolean;
  isPending: boolean;
}

const ImportantNoticeModal = (props: Props) => {
  const { onSave, setIsShowRecalculation, IsShowRecalculation, isPending } =
    props;
  const isMobile = useDeviceDetection();

  const modalContent = (
    <div className='flex h-full flex-col justify-between p-4'>
      <div className='mb-10 w-full text-center text-[16px] font-normal leading-[25px] text-[#000000] md:mb-2 md:text-[24px] md:font-semibold md:leading-[30px] md:text-[#171A1F]'>
        Important Notice: Quote Recalculation
      </div>

      {!isMobile.isMobile && (
        <div className='mt-2 rounded-lg bg-[#81899414] px-2 py-4 text-center text-[15px] font-[300] leading-[25px] text-[#000000]'>
          Please note that any changes to these details will impact your quote,
          and a new quote will be generated accordingly.
        </div>
      )}

      <div className='mt-6 flex w-full justify-center gap-4 md:flex-col'>
        <SecondaryButton
          className='flex-1 md:py-4'
          onClick={() => setIsShowRecalculation(false)}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={onSave}
          className='flex-1 text-white md:py-5'
          loading={isPending}
        >
          Proceed
        </PrimaryButton>
      </div>
    </div>
  );

  return isMobile.isMobile ? (
    <Drawer
      placement='bottom'
      open={IsShowRecalculation}
      closable={false}
      height='auto'
      className='rounded-t-xl'
    >
      {modalContent}
    </Drawer>
  ) : (
    <Modal
      open={IsShowRecalculation}
      closable={false}
      footer={null}
      centered
      onCancel={() => setIsShowRecalculation(false)}
    >
      {modalContent}
    </Modal>
  );
};

export default ImportantNoticeModal;

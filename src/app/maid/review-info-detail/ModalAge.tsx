'use client';

import { Drawer, Modal } from 'antd';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { PrimaryButton } from '@/components/ui/buttons';
import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { ROUTES } from '@/constants/routes';

interface Props {
  isShowModal: boolean;
  setIsShowModal: (isShowModal: boolean) => void;
}

export const ModalAge = ({ isShowModal, setIsShowModal }: Props) => {
  const isMobile = useDeviceDetection();
  const router = useRouterWithQuery();

  const content = (
    <div className='flex flex-col items-center gap-4'>
      <WarningTriangleIcon size={70} />
      <p className='text-[24px] font-normal leading-[32px] text-[#000000D9]'>
        Invalid Employer's Age
      </p>
      <div className='flex flex-col justify-center gap-4 text-center text-sm font-normal leading-[22px] text-[#00000073]'>
        <p>
          Based on the details retrieved from MyInfo via Singpass,{' '}
          <span className='font-bold'>
            your date of birth indicates an age below 21.
          </span>{' '}
        </p>
        <p className='text-sm font-bold leading-[22px] text-[#00000073]'>
          According to Employer Requirement of MOM, the employer must be 21
          years of age or older.{' '}
        </p>
        <p>
          If you wish to get a quote, you'll need to manually fill in your
          personal information and helper's details.
        </p>
        <p>
          If you're okay with this, please click the “Continue” button below to
          proceed. Otherwise, you may exit the page.
        </p>
      </div>
      <div className='flex flex-col justify-between gap-4 md:flex-row'>
        <PrimaryButton
          className='w-[90vw] rounded-lg border border-[#C80F1E] bg-white text-center text-base font-bold leading-[21px] !text-[#C80F1E] md:w-40'
          onClick={() => {
            router.push(ROUTES.MAID.LOGIN, { preserveQuery: false });
          }}
        >
          Exit
        </PrimaryButton>
        <PrimaryButton
          className='w-[90vw] bg-[#00ADEF] md:w-40'
          onClick={() => {
            router.push(ROUTES.INSURANCE_MAID.BASIC_DETAIL_MANUAL, {
              preserveQuery: false,
            });
          }}
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
  return (
    <>
      {isMobile.isMobile ? (
        <Drawer
          placement='bottom'
          open={isShowModal}
          onClose={() => setIsShowModal(false)}
          closable={false}
          height='auto'
          className='rounded-t-xl'
        >
          {content}
        </Drawer>
      ) : (
        <Modal
          open={isShowModal}
          onCancel={() => setIsShowModal(false)}
          closable={false}
          maskClosable={true}
          keyboard={true}
          footer={null}
          width={385}
          centered
        >
          {content}
        </Modal>
      )}
    </>
  );
};

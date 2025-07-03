import { useState } from 'react';

import EditIcon from '@/components/icons/EditIcon';
import ModalImportant from '@/components/page/insurance/complete-purchase/ModalImportant';
import { PrimaryButton } from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { useAppSelector } from '@/redux/store';

interface Props {
  title: string;
  data: { title: string; value: any }[];
  setShowModal: (showModal: boolean) => void;
  editRoute?: string;
  isPendingSave?: boolean;
  isPendingPay?: boolean;
}

const ReviewDesktop = (props: Props) => {
  const { title, data, setShowModal, editRoute, isPendingSave, isPendingPay } =
    props;
  const router = useRouterWithQuery();
  const [isShowPopupImportant, setIsShowPopupImportant] = useState(false);
  const isFinalized = useAppSelector(
    (state) => state.quote?.quote?.is_finalized,
  );

  const handleEditClick = () => {
    if (editRoute === ROUTES.INSURANCE.BASIC_DETAIL) {
      setIsShowPopupImportant(true);
    } else {
      handleRedirect();
    }
  };

  const handleRedirect = () => {
    if (editRoute) {
      router.push(editRoute);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className='mt-6 flex w-full flex-col justify-center gap-4 rounded-2xl border p-4 shadow-sm'>
        <div className='flex w-full flex-row items-center justify-between'>
          <p className='text-xl font-bold leading-[30px] text-[#0095CE]'>
            {title}
          </p>
          <PrimaryButton
            onClick={handleEditClick}
            className='flex cursor-pointer flex-row items-center gap-2 rounded-[53px] border-[0.5px] bg-[#00ADEF] px-6 py-3 text-[14px] font-bold leading-4 text-white'
            disabled={isPendingSave || isPendingPay || isFinalized}
          >
            <EditIcon className='cursor-pointer text-white' size={18} />
            Edit
          </PrimaryButton>
        </div>
        <div className='flex flex-wrap gap-x-6 gap-y-3'>
          {data.map((item, index) => (
            <div key={index} className='flex flex-col gap-2'>
              <p className='text-sm font-semibold leading-6 text-[#000000]'>
                {item.title}
              </p>
              {item.value && (
                <p className='rounded-xl bg-[#0000000D] px-1 py-2 text-center text-base font-normal leading-[26px] text-[#535353]'>
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {isShowPopupImportant && (
        <ModalImportant
          isShowPopupImportant={isShowPopupImportant}
          handleRedirect={handleRedirect}
          setIsShowPopupImportant={setIsShowPopupImportant}
        />
      )}
    </>
  );
};
export default ReviewDesktop;

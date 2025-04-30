import { useState } from 'react';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

import ConfirmInfoCompletedModal from './ConfirmInfoCompletedModal';
import ConfirmInfoModal from './ConfirmInfoModal';

interface ConfirmInfoModalWrapperProps {
  showConfirmModal: boolean;
  setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmInfoModalWrapper = (props: ConfirmInfoModalWrapperProps) => {
  const { showConfirmModal, setShowConfirmModal } = props;
  const [isSaved, setIsSaved] = useState(false);
  const { isMobile } = useDeviceDetection();

  const handleClose = () => {
    setShowConfirmModal(false);
    setIsSaved(false);
  };

  return (
    showConfirmModal && (
      <div
        className={`fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50 ${isMobile ? 'items-end' : 'items-center'}`}
      >
        <div
          className={`flex max-h-screen w-full animate-slide-up flex-col ${isMobile ? 'rounded-t-lg' : 'rounded-lg'} bg-white shadow-lg sm:w-[490px]`}
        >
          {isSaved ? (
            <ConfirmInfoCompletedModal />
          ) : (
            <ConfirmInfoModal
              onSave={() => setIsSaved(true)}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    )
  );
};

export default ConfirmInfoModalWrapper;

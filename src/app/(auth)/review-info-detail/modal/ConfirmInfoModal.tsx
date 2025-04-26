import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

const ConfirmInfoModal = ({
  onSave,
  onClose,
}: {
  onSave: () => void;
  onClose: () => void;
}) => {
  const { isMobile } = useDeviceDetection();

  return (
    <div className='mx-auto flex h-full w-full flex-col justify-between p-6'>
      <div>
        <div className='text-center text-lg font-bold'>Save Your Progress</div>
        <div
          className={`mt-4 ${isMobile ? 'text-sm' : 'rounded bg-gray-100 p-2 text-sm'}`}
        >
          We can email you a link to continue later from where you left off.
        </div>
      </div>
      <div className={`flex flex-col gap-4 ${isMobile ? 'mt-20' : 'mt-4'}`}>
        <PrimaryButton
          onClick={onSave}
          className='rounded-md px-4 py-2 text-white transition'
        >
          Save my progress
        </PrimaryButton>
        <SecondaryButton
          onClick={onClose}
          className='rounded-md px-4 py-2 text-gray-700 transition'
        >
          Exit without saving
        </SecondaryButton>
      </div>
    </div>
  );
};

export default ConfirmInfoModal;

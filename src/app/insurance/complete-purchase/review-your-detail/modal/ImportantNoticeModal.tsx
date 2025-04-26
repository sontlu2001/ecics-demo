import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

const ImportantNoticeModal = ({ onSave }: { onSave: () => void }) => {
  return (
    <div className='flex h-full flex-col justify-between p-6'>
      <div className='text-center text-lg'>
        Important Notice: Quote Recalculation
      </div>

      <div className='mt-6 flex w-full justify-center gap-4'>
        <SecondaryButton className='flex-1'>Cancel</SecondaryButton>
        <PrimaryButton onClick={onSave} className='flex-1 text-white'>
          Proceed
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ImportantNoticeModal;

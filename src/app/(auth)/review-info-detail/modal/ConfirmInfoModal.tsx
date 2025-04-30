import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { SavePersonalInfoPayload } from '@/libs/types/auth';
import { convertDateToDDMMYYYY } from '@/libs/utils/date-utils';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { ECICS_USER_INFO } from '@/constants/general.constant';
import { usePostPersonalInfo } from '@/hook/auth/login';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const ConfirmInfoModal = ({
  onSave,
  onClose,
}: {
  onSave: () => void;
  onClose: () => void;
}) => {
  const { isMobile } = useDeviceDetection();
  const { mutate: savePersonalInfo, isSuccess } = usePostPersonalInfo();

  useEffect(() => {
    if (isSuccess) {
      onSave();
    }
  }, [isSuccess]);

  const handleSave = async () => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    if (!stored) {
      toast.error('Missing user info in session.');
      return;
    }

    const parsed = JSON.parse(stored);

    const payload: SavePersonalInfoPayload = {
      email: parsed.email?.value || '',
      phone: `${parsed.mobileno?.nbr?.value || ''}`,
      name: parsed.name?.value || '',
      nric: parsed.uinfin?.value || '',
      gender: parsed.sex?.desc || '',
      marital_status: parsed.marital?.desc || '',
      date_of_birth: parsed.dob?.value
        ? convertDateToDDMMYYYY(parsed.dob.value)
        : '',
      address: `${parsed.regadd?.block?.value || ''} ${parsed.regadd?.street?.value || ''} #${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}, ${parsed.regadd?.postal?.value || ''}, ${parsed.regadd?.country?.desc || ''}`,
      vehicle_make: parsed.vehicle_make || '',
      vehicle_model: parsed.vehicle_model || '',
      year_of_registration: parsed.year_of_registration || '',
      vehicles:
        parsed.vehicles?.map((v: any) => ({
          vehicleno: {
            value: v.vehicleno?.value || '',
          },
          chassisno: {
            value: v.chassisno?.value || '',
          },
          make: {
            value: v.make?.value || '',
          },
          model: {
            value: v.model?.value || '',
          },
          engineno: {
            value: v.engineno?.value || '',
          },
        })) || [],
      key: `key-${Date.now()}`,
    };
    savePersonalInfo(payload);
  };

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
          onClick={handleSave}
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

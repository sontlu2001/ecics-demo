import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

import { SavePersonalInfoPayload } from '@/libs/types/auth';
import {
  calculateDrivingExperienceFromLicences,
  convertDateToDDMMYYYY,
  extractYear,
} from '@/libs/utils/date-utils';
import { calculateAge } from '@/libs/utils/utils';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { UnableQuote } from '@/app/insurance/basic-detail/modal/UnableQuote';
import { ECICS_USER_INFO } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { usePostPersonalInfo } from '@/hook/auth/login';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const ConfirmInfoModal = ({
  onSave,
  onFail,
  onClose,
}: {
  onSave: () => void;
  onFail: () => void;
  onClose: () => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();
  const partner_code = searchParams.get('partner_code') || '';
  const promo_code = searchParams.get('promo_code')?.toUpperCase().trim() || '';
  const {
    mutate: savePersonalInfo,
    isSuccess,
    isError,
  } = usePostPersonalInfo();

  const [showOverAgeModal, setShowOverAgeModal] = useState(false);
  const handleGoBack = () => {
    setShowOverAgeModal(false);
    router.push(ROUTES.AUTH.LOGIN);
  };

  useEffect(() => {
    if (isSuccess) {
      onSave();
    } else if (isError) {
      onFail();
    }
  }, [isSuccess, isError]);

  const handleSave = async () => {
    const stored = sessionStorage.getItem(ECICS_USER_INFO);
    if (!stored) {
      toast.error('Missing user info in session.');
      return;
    }

    const parsed = JSON.parse(stored);
    const qdlClasses = parsed?.drivinglicence?.qdl?.classes || [];
    const payload: SavePersonalInfoPayload = {
      key: `${uuid()}`,
      is_sending_email: true,
      promo_code: promo_code,
      partner_code: partner_code,
      personal_info: {
        name: parsed.name?.value || '',
        gender: parsed.sex?.desc || '',
        marital_status: parsed.marital?.desc || '',
        nric: parsed.uinfin?.value || '',
        address: [
          `${parsed.regadd?.block?.value || ''} ${parsed.regadd?.street?.value || ''} #${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}, ${parsed.regadd?.postal?.value || ''}, ${parsed.regadd?.country?.desc || ''}`,
        ].filter(Boolean),
        date_of_birth: parsed.dob?.value
          ? convertDateToDDMMYYYY(parsed.dob.value)
          : '',
        year_of_registration: parsed.year_of_registration || '',
        driving_experience:
          qdlClasses.length > 0
            ? `${calculateDrivingExperienceFromLicences(qdlClasses)} years`
            : '1 year',
        phone: `${parsed.mobileno?.nbr?.value || ''}`,
        email: parsed.email?.value || '',
      },
      vehicle_info_selected: {
        vehicle_number: parsed.vehicles[0].vehicleno?.value || '',
        first_registered_year:
          extractYear(parsed.vehicles[0].firstregistrationdate?.value) || '',
        vehicle_make: parsed.vehicles[0].make?.value || '',
        vehicle_model: parsed.vehicles[0].model?.value || '',
        engine_number: parsed.vehicles[0].engineno?.value || '',
        chasis_number: parsed.vehicles[0].chassisno?.value || '',
        engine_capacity: parsed.vehicles[0].enginecapacity?.value || '',
        power_rate: parsed.vehicles[0].powerrate?.value || '',
        year_of_manufacture: parsed.vehicles[0].yearofmanufacture?.value || '',
      },
      vehicles:
        parsed.vehicles?.map((v: any) => ({
          chasis_number: v.vehicleno?.value || '',
          vehicle_make: v.make?.value || '',
          vehicle_model: v.model?.value || '',
          first_registered_year: v.year_of_registration || '',
        })) || [],
    };

    //Check age
    const age = calculateAge(payload?.personal_info.date_of_birth);
    if (age < 26 || age > 70) {
      setShowOverAgeModal(true);
      return;
    }

    savePersonalInfo({ ...payload, shouldRedirect: false });
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
      <UnableQuote onClick={handleGoBack} visible={showOverAgeModal} />
    </div>
  );
};

export default ConfirmInfoModal;

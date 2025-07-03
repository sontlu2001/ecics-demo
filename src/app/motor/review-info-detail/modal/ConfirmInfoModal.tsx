import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { SavePersonalInfoPayload } from '@/libs/types/auth';
import {
  calculateDrivingExperienceFromLicences,
  convertDateToDDMMYYYY,
  extractYear,
} from '@/libs/utils/date-utils';
import { calculateAge } from '@/libs/utils/utils';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { usePostPersonalInfo } from '@/hook/auth/login';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import { UnableQuote } from '../../insurance/basic-detail/modal/UnableQuote';

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
  const { isMobile } = useDeviceDetection();
  const partner_code = localStorage.getItem(PARTNER_CODE);
  const promo_code = localStorage.getItem(PROMO_CODE);

  const {
    mutate: savePersonalInfo,
    isSuccess,
    isError,
  } = usePostPersonalInfo();

  const [showOverAgeModal, setShowOverAgeModal] = useState(false);
  const handleGoBack = () => {
    setShowOverAgeModal(false);
    router.push(ROUTES.MOTOR.LOGIN);
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
    const singpassDataRaw = sessionStorage.getItem(DATA_FROM_SINGPASS);

    if (!stored || !singpassDataRaw) return;

    const parsed = JSON.parse(stored);
    const parsedSingpass = JSON.parse(singpassDataRaw);

    const qdlClasses = parsed?.drivinglicence?.qdl?.classes || [];
    const drivingYears = calculateDrivingExperienceFromLicences(qdlClasses);

    const payload: SavePersonalInfoPayload = {
      key: `${uuid()}`,
      is_sending_email: true,
      promo_code: promo_code || '',
      partner_code: partner_code || '',
      personal_info: {
        name: parsed.name?.value || '',
        gender: parsed.sex?.desc || '',
        marital_status: parsed.marital?.desc || '',
        nric: parsed.uinfin?.value || '',
        address: [
          `${parsed.regadd?.block?.value || ''} ${parsed.regadd?.street?.value || ''} #${parsed.regadd?.floor?.value || ''}-${parsed.regadd?.unit?.value || ''}, ${parsed.regadd?.postal?.value || ''}, ${parsed.regadd?.country?.desc || ''}`,
        ].filter(Boolean),
        post_code: parsed.regadd?.postal?.value || '',
        date_of_birth: parsed.dob?.value
          ? convertDateToDDMMYYYY(parsed.dob.value)
          : '',
        driving_experience:
          qdlClasses.length > 0
            ? drivingYears >= 6
              ? '6 years and above'
              : `${drivingYears} years`
            : '1 year',
        phone: `${parsed.mobileno?.nbr?.value || ''}`,
        email: parsed.email?.value.toLowerCase() || '',
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
      data_from_singpass: parsedSingpass,
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

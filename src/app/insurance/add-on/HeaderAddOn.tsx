import EditIcon from '@/components/icons/EditIcon';
import { SecondaryButton } from '@/components/ui/buttons';
import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { Vehicle } from '@/libs/types/quote';

interface Props {
  setIsModalVisible: (isVisible: boolean) => void;
  selectPlan?: string;
  vehicleInfo?: Vehicle;
  insuranceAdditionalInfo?: number;
}

const HeaderAddOn = ({
  setIsModalVisible,
  selectPlan,
  vehicleInfo,
  insuranceAdditionalInfo,
}: Props) => {
  const router = useRouterWithQuery();

  const CAR_INFO = [
    `${vehicleInfo?.vehicle_make} ${vehicleInfo?.vehicle_model}`,
    vehicleInfo?.chasis_number,
    vehicleInfo?.first_registered_year,
    `NCD: ${insuranceAdditionalInfo}%`,
  ];
  const INSURANCE_PLAN = selectPlan;

  const renderInfoCar = () => (
    <div className='flex items-center justify-between rounded-2xl border border-[#EEEEEE] px-6 py-3 shadow-sm'>
      <div className='flex items-center gap-4'>
        {CAR_INFO.map((item, index) => (
          <div key={index} className='flex items-center gap-4'>
            <p className='rounded-lg bg-[#0000000D] px-4 py-2 text-base font-semibold text-[#151515]'>
              {item}
            </p>
            <p className='h-1 w-1 rounded-full bg-black'></p>
          </div>
        ))}
        <SecondaryButton
          className='flex items-center rounded-[52px] bg-[#00ADEF] px-5 py-2 font-bold text-white'
          icon={<EditIcon size={18} className='mt-1' />}
          onClick={() => router.push(ROUTES.INSURANCE.BASIC_DETAIL)}
        >
          Edit
        </SecondaryButton>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className='flex items-center justify-center rounded-2xl border border-[#EEEEEE] px-6 py-3 shadow-sm'>
      <div className='flex items-center gap-6'>
        <p className='rounded-lg bg-[#0000000D] px-4 py-2 text-base font-semibold text-[#151515]'>
          Insurance Plan:{' '}
          <span className='font-normal text-[#535353]'>{INSURANCE_PLAN}</span>
        </p>
        <SecondaryButton
          className='flex items-center rounded-[52px] bg-[#00ADEF] px-5 py-2 font-bold text-white'
          icon={<EditIcon size={18} className='mt-1' />}
          onClick={() => router.push(ROUTES.INSURANCE.PLAN)}
        >
          Edit
        </SecondaryButton>
      </div>
    </div>
  );

  return (
    <div className='hidden w-full items-center justify-between gap-4 md:flex md:flex-col xl:flex-row xl:gap-6'>
      {renderInfoCar()}
      {renderInsurance()}
    </div>
  );
};

export default HeaderAddOn;

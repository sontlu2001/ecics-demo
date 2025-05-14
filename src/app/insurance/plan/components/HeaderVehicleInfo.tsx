import EditIcon from '@/components/icons/EditIcon';
import { SecondaryButton } from '@/components/ui/buttons';
import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { InsuranceAdditionalInfo, Vehicle } from '@/libs/types/quote';

interface Props {
  vehicleInfo?: Vehicle;
  insuranceAdditionalInfo?: InsuranceAdditionalInfo;
  selectPlan?: string;
  isShowScreen?: boolean;
}

const HeaderVehicleInfo = ({
  vehicleInfo,
  insuranceAdditionalInfo,
  selectPlan,
  isShowScreen,
}: Props) => {
  const router = useRouterWithQuery();
  const INSURANCE_PLAN = selectPlan;

  const vehicleInfoList = [
    `${vehicleInfo?.vehicle_make} ${vehicleInfo?.vehicle_model}`,
    vehicleInfo?.chasis_number,
    vehicleInfo?.first_registered_year,
    `NCD: ${insuranceAdditionalInfo?.no_claim_discount}%`,
    ...(!isShowScreen
      ? [
          `Policy Period: ${insuranceAdditionalInfo?.start_date} to ${insuranceAdditionalInfo?.end_date}`,
        ]
      : []),
  ];

  const renderInfoCar = () => (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        {vehicleInfoList.map((item, index) => {
          const isLastItem = index === vehicleInfoList.length - 1;
          return (
            <div key={index} className='flex items-center gap-4'>
              <p className='rounded-lg bg-[#0000000D] px-4 py-2 text-base font-semibold text-[#151515]'>
                {item}
              </p>
              {!isLastItem && <p className='h-1 w-1 rounded-full bg-black'></p>}
            </div>
          );
        })}
      </div>

      {!isShowScreen && (
        <div className='flex flex-row'>
          <div className='flex items-center gap-4'>
            <p className='rounded-lg bg-[#0000000D] px-4 py-2 text-base font-semibold text-[#151515]'>
              Claims in past 3 years: {insuranceAdditionalInfo?.no_of_claim}
            </p>
          </div>
        </div>
      )}
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
    <>
      <div className='flex w-full flex-row justify-between'>
        <div
          className={`hidden ${!isShowScreen ? 'w-full justify-between ' : ''}items-center gap-2 rounded-2xl border border-[#EEEEEE] px-6 py-3 shadow-sm md:flex md:flex-col xl:flex-row xl:gap-6`}
        >
          {' '}
          {renderInfoCar()}
          <SecondaryButton
            className='flex items-center rounded-[52px] bg-[#00ADEF] px-5 py-2 font-bold text-white'
            icon={<EditIcon size={18} className='mt-1' />}
            onClick={() => router.push(ROUTES.INSURANCE.BASIC_DETAIL)}
          >
            Edit
          </SecondaryButton>
        </div>
        {isShowScreen && renderInsurance()}
      </div>
    </>
  );
};

export default HeaderVehicleInfo;

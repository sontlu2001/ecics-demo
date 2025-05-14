import EditIcon from '@/components/icons/EditIcon';
import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { Vehicle } from '@/libs/types/auth';

interface Props {
  vehicleInfo?: Vehicle;
}

const HeaderVehicleInfoMobile = (props: Props) => {
  const { vehicleInfo } = props;
  const router = useRouterWithQuery();

  return (
    <div className='w-full px-4'>
      <div className='flex flex-row items-center justify-between rounded-lg border border-[#00ADEF] bg-[#F4FBFD] p-2'>
        <span className='text-[14px] font-semibold leading-[19px] '>
          {vehicleInfo?.vehicle_number} - {vehicleInfo?.vehicle_make}{' '}
          {vehicleInfo?.vehicle_model} - {vehicleInfo?.first_registered_year}
        </span>
        <div
          onClick={() => {
            router.push(ROUTES.INSURANCE.BASIC_DETAIL);
          }}
          className='flex flex-row items-center gap-1 rounded-lg border border-[#00ADEF] bg-[#00ADEF] px-2 py-1 text-xs font-semibold text-white'
        >
          <EditIcon className='text-black' size={10} />
          Edit
        </div>
      </div>
    </div>
  );
};

export default HeaderVehicleInfoMobile;

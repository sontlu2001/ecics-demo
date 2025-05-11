import { EditOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { useState } from 'react';

import { Vehicle } from '@/libs/types/quote';

import { VehicleSelectionModal } from '@/app/insurance/components/VehicleSelection';

interface VehicleBarProps {
  selected_vehicle: Vehicle | null;
  setSelectedVehicle: (selected: Vehicle | null) => void;
  vehicles: Vehicle[];
}

const VehicleBar = ({
  selected_vehicle,
  setSelectedVehicle,
  vehicles,
}: VehicleBarProps) => {
  const [isVehSelectionVisible, setIsVehSelectionVisible] = useState(false);

  const handleSelection = (selected: Vehicle | null) => {
    if (selected) {
      setSelectedVehicle(selected);
    }
    setIsVehSelectionVisible(false);
  };
  const onEditClick = () => {
    setIsVehSelectionVisible(true);
  };
  return (
    <>
      <Flex className='flex w-full max-w-2xl items-center justify-around rounded-lg border border-blue-400 bg-sky-50 px-1 py-2 font-semibold'>
        <span className='flex w-3/4 max-w-[60vw] px-1 text-xs sm:text-sm'>
          {/* <div className='mx-auto'> */}
          <span>{selected_vehicle?.chasis_number}</span>
          <span className='px-2'>-</span>
          <span className='overflow-hidden truncate whitespace-nowrap'>
            {selected_vehicle?.vehicle_make} {selected_vehicle?.vehicle_model}
          </span>
          <span className='px-2'>-</span>
          <span>{selected_vehicle?.first_registered_year}</span>
          {/* </div> */}
        </span>
        <span className='m-0 min-w-fit'>
          <Button
            icon={<EditOutlined />}
            className='rounded-3xl border border-blue-400 bg-sky-200 font-semibold text-blue-400'
            onClick={onEditClick}
          >
            Edit
          </Button>
        </span>
      </Flex>
      <VehicleSelectionModal
        vehicles={vehicles}
        visible={isVehSelectionVisible}
        selected={selected_vehicle}
        setSelected={handleSelection}
        setShowChooseVehicleModal={setIsVehSelectionVisible}
        onClose={() => setIsVehSelectionVisible(false)}
      />
    </>
  );
};

export default VehicleBar;

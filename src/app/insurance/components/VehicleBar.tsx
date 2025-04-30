import { EditOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import React from 'react';
import { VehicleSelection } from '@/components/VehicleSelection';

interface VehicleBarProps {
  selected_vehicle: VehicleSelection;
  onClick: () => void;
}

const VehicleBar = ({ selected_vehicle, onClick }: VehicleBarProps) => {
  return (
    <>
      <Flex className='flex w-full max-w-2xl items-center justify-around rounded-lg border border-blue-400 bg-sky-50 px-1 py-2 font-semibold'>
        <span className='flex w-3/4 max-w-[60vw] px-1 text-xs sm:text-sm'>
          {/* <div className='mx-auto'> */}
          <span>{selected_vehicle.regNo}</span>
          <span className='px-2'>-</span>
          <span className='overflow-hidden truncate whitespace-nowrap'>
            {selected_vehicle.make} {selected_vehicle.model}
          </span>
          <span className='px-2'>-</span>
          <span>{selected_vehicle.first_registered_year}</span>
          {/* </div> */}
        </span>
        <span className='m-0 min-w-fit'>
          <Button
            icon={<EditOutlined />}
            className='rounded-3xl border border-blue-400 bg-sky-200 font-semibold text-blue-400'
            onClick={onClick}
          >
            Edit
          </Button>
        </span>
      </Flex>
    </>
  );
};

export default VehicleBar;

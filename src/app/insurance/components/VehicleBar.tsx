import { Button, Flex } from 'antd';
import React from 'react';
import { EditOutlined } from '@ant-design/icons';

interface VehicleBarProps {
  regNo: string;
  vehMake: string;
  vehModel: string;
  regYear: number;
  onClick: () => void;
}

const VehicleBar = ({
  regNo,
  vehMake,
  vehModel,
  regYear,
  onClick,
}: VehicleBarProps) => {
  return (
    <>
      <Flex className='flex w-full max-w-2xl items-center justify-around rounded-lg border border-blue-400 bg-sky-50 px-1 py-2 font-semibold'>
        <span className='flex w-3/4 px-1'>
          {/* <div className='mx-auto'> */}
          <span>{regNo}</span>
          <span className='px-2'>-</span>
          <span className='overflow-hidden truncate whitespace-nowrap'>
            {vehMake} {vehModel}
          </span>
          <span className='px-2'>-</span>
          <span>{regYear}</span>
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

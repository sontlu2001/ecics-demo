'use client';

import React, { useState } from 'react';
import { Modal, Radio, Space, Drawer, Typography } from 'antd';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { PrimaryButton } from './ui/buttons';

export interface VehicleSelection {
  regNo: string;
  make: string;
  model: string;
  first_registered_year: number;
}

interface VehicleSelectionModalProps {
  vehicles: VehicleSelection[];
  visible: boolean;
  onSubmit: (selected: VehicleSelection | null) => void;
}

const commonFontClass = 'mt-3 font-normal text-base leading-none break-words';

export const VehicleSelectionModal = ({
  vehicles,
  visible,
  onSubmit,
}: VehicleSelectionModalProps) => {
  const { isMobile } = useDeviceDetection();
  const [selected, setSelected] = useState<string | null>(null);

  const onClick = () => {
    const selectedVehicle = vehicles.find((v) => v.regNo === selected);
    onSubmit(selectedVehicle || null);
    setSelected(null);
  };

  const content = (
    <>
      <div className='mb-3 break-words text-base font-bold leading-none'>
        Select the vehicle you want to insure now
      </div>
      <Radio.Group
        onChange={(e) => setSelected(e.target.value)}
        value={selected}
        className='w-full'
      >
        <Space direction='vertical' className='my-3'>
          {vehicles?.map((vehicle, index) => (
            <Space
              key={index}
              direction='horizontal'
              align='baseline'
              className='-my-3 w-full'
            >
              <Radio key={index} value={vehicle.regNo}>
                <Typography.Paragraph className={commonFontClass + ' w-32'}>
                  {vehicle.regNo}
                </Typography.Paragraph>
              </Radio>
              <Typography.Paragraph className={commonFontClass}>
                ●
              </Typography.Paragraph>
              <Typography.Paragraph className={commonFontClass}>
                {vehicle.make} {vehicle.model}
              </Typography.Paragraph>
            </Space>
          ))}
        </Space>
      </Radio.Group>

      <PrimaryButton onClick={onClick} disabled={!selected} className='w-full'>
        Continue
      </PrimaryButton>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          placement='bottom'
          open={visible}
          closable={false}
          height='auto'
          className='rounded-t-xl'
        >
          {content}
        </Drawer>
      ) : (
        <Modal
          open={visible}
          onOk={onClick}
          closable={false}
          maskClosable={false}
          keyboard={false}
          footer={null}
          centered
        >
          {content}
        </Modal>
      )}
    </>
  );
};

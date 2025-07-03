'use client';

import { Drawer, Modal, Radio, Space, Typography } from 'antd';
import { useState } from 'react';

import { Vehicle } from '@/libs/types/quote';

import { PrimaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface VehicleSelectionModalProps {
  isReviewScreen?: boolean;
  vehicles: Vehicle[];
  visible: boolean;
  selected?: Vehicle | null;
  setSelected: (selected: Vehicle | null) => void;
}

const defaultProps = {
  isReviewScreen: false,
};

const commonFontClass = 'mt-3 font-normal text-base leading-none break-words';

export const VehicleSelectionModal = ({
  isReviewScreen,
  vehicles,
  visible,
  selected,
  setSelected,
}: VehicleSelectionModalProps) => {
  const { isMobile } = useDeviceDetection();
  const [selectedChasisNumber, setSelectedChasisNumber] = useState(
    selected?.chasis_number,
  );

  const handleClick = () => {
    const selectedVehicle = vehicles.find(
      (v) => v.chasis_number === selectedChasisNumber,
    );
    setSelected(selectedVehicle || null);
  };

  const content = (
    <>
      {isReviewScreen && (
        <div className='mb-3 text-base'>
          We have found multiple vehicles in your Myinfo data
        </div>
      )}
      <div className='mb-3 break-words text-base font-bold leading-none'>
        Select the vehicle you want to insure now
      </div>

      <Radio.Group
        onChange={(e) => setSelectedChasisNumber(e.target.value)}
        value={selectedChasisNumber}
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
              <Radio key={index} value={vehicle.chasis_number}>
                <Typography.Paragraph className={`${commonFontClass} w-32`}>
                  {vehicle.chasis_number}
                </Typography.Paragraph>
              </Radio>
              <Typography.Paragraph className={commonFontClass}>
                ●
              </Typography.Paragraph>
              <Typography.Paragraph className={commonFontClass}>
                {vehicle.vehicle_make} {vehicle.vehicle_model}
              </Typography.Paragraph>
            </Space>
          ))}
        </Space>
      </Radio.Group>

      <PrimaryButton
        onClick={handleClick}
        disabled={!selectedChasisNumber}
        className='w-full'
      >
        {isReviewScreen ? 'Submit' : 'Continue'}
      </PrimaryButton>
    </>
  );

  return isMobile ? (
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
      onOk={handleClick}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={null}
      centered
    >
      {content}
    </Modal>
  );
};

VehicleSelectionModal.defaultProps = defaultProps;

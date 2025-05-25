'use client';

import { Drawer, Modal, Radio, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { SavePersonalInfoPayload } from '@/libs/types/auth';
import { Vehicle } from '@/libs/types/quote';
import {
  calculateDrivingExperienceFromLicences,
  convertDateToDDMMYYYY,
  extractYear,
} from '@/libs/utils/date-utils';
import { saveToSessionStorage } from '@/libs/utils/utils';

import { PrimaryButton } from '@/components/ui/buttons';

import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { usePostPersonalInfo } from '@/hook/auth/login';
import { usePostCheckVehicle } from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import { UnableQuote } from '../basic-detail/modal/UnableQuote';
import UnMatchVehicleModal from '../../review-info-detail/modal/UnMatchVehicleModal';

interface VehicleSelectionModalProps {
  isReviewScreen?: boolean;
  vehicles: Vehicle[];
  visible: boolean;
  selected?: Vehicle | null;
  setSelected: (selected: Vehicle | null) => void;
  onClose?: () => void;
  setShowChooseVehicleModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshSession?: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultProps = {
  isReviewScreen: false,
};

const commonFontClass = 'mt-3 font-normal text-base leading-none break-words';

export const VehicleSelectionModal = ({
  isReviewScreen,
  vehicles,
  visible,
  setShowChooseVehicleModal,
  selected,
  setSelected,
  setRefreshSession,
  onClose,
}: VehicleSelectionModalProps) => {
  const { isMobile } = useDeviceDetection();
  const [selectedChasisNumber, setSelectedChasisNumber] = useState(
    selected?.chasis_number,
  );
  const partner_code = localStorage.getItem(PARTNER_CODE);
  const promo_code = localStorage.getItem(PROMO_CODE);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showUnMatchModal, setShowUnMatchModal] = useState(false);

  const { mutate: savePersonalInfo } = usePostPersonalInfo();
  const { mutate: postCheckVehicle, isSuccess } = usePostCheckVehicle(() => {
    setShowUnMatchModal(true);
  });

  const handleCloseContactModal = () => {
    setShowContactModal(false);
  };

  useEffect(() => {
    setSelectedChasisNumber(selected?.chasis_number);
  }, [selected]);

  useEffect(() => {
    if (isSuccess) {
      const sessionDataRaw = sessionStorage.getItem(ECICS_USER_INFO);
      const singpassDataRaw = sessionStorage.getItem(DATA_FROM_SINGPASS);

      if (!sessionDataRaw || !singpassDataRaw) return;

      const updatedParsed = JSON.parse(sessionDataRaw);
      const parsedSingpass = JSON.parse(singpassDataRaw);

      const v = updatedParsed.vehicle_selected || {};

      const vehicle_info_selected = {
        vehicle_number: v.vehicleno?.value || '',
        first_registered_year:
          extractYear(v.firstregistrationdate?.value) || '',
        vehicle_make: v.make?.value || '',
        vehicle_model: v.model?.value || '',
        engine_number: v.engineno?.value || '',
        chasis_number: v.chassisno?.value || '',
        engine_capacity: v.enginecapacity?.value || '',
        power_rate: v.powerrate?.value || '',
        year_of_manufacture: v.yearofmanufacture?.value || '',
      };

      const qdlClasses = updatedParsed?.drivinglicence?.qdl?.classes || [];
      const drivingYears = calculateDrivingExperienceFromLicences(qdlClasses);

      const payload: SavePersonalInfoPayload = {
        key: `${uuid()}`,
        is_sending_email: false,
        promo_code: promo_code || '',
        partner_code: partner_code || '',
        personal_info: {
          name: updatedParsed.name?.value || '',
          gender: updatedParsed.sex?.desc || '',
          marital_status: updatedParsed.marital?.desc || '',
          nric: updatedParsed.uinfin?.value || '',
          address: [
            `${updatedParsed.regadd?.block?.value || ''} ${updatedParsed.regadd?.street?.value || ''} #${updatedParsed.regadd?.floor?.value || ''}-${updatedParsed.regadd?.unit?.value || ''}, ${updatedParsed.regadd?.postal?.value || ''}, ${updatedParsed.regadd?.country?.desc || ''}`,
          ].filter(Boolean),
          post_code: updatedParsed.regadd?.postal?.value || '',
          date_of_birth: updatedParsed.dob?.value
            ? convertDateToDDMMYYYY(updatedParsed.dob.value)
            : '',
          year_of_registration: updatedParsed.year_of_registration || '',
          driving_experience:
            qdlClasses.length > 0
              ? drivingYears >= 6
                ? '6 years and above'
                : `${drivingYears} years`
              : '1 year',
          phone: `${updatedParsed.mobileno?.nbr?.value || ''}`,
          email: updatedParsed.email?.value || '',
        },
        vehicle_info_selected,
        vehicles:
          updatedParsed.vehicles?.map((v: any) => ({
            chasis_number: v.vehicleno?.value || '',
            vehicle_make: v.make?.value || '',
            vehicle_model: v.model?.value || '',
            first_registered_year:
              extractYear(v.firstregistrationdate?.value) || '',
          })) || [],
        data_from_singpass: parsedSingpass,
      };
      savePersonalInfo(payload);
    }
  }, [isSuccess]);

  const handleClick = () => {
    const selectedVehicle = vehicles.find(
      (v) => v.chasis_number === selectedChasisNumber,
    );

    if (isReviewScreen) {
      const sessionDataRaw = sessionStorage.getItem(ECICS_USER_INFO);
      if (!sessionDataRaw || !selectedVehicle) return;

      const parsed = JSON.parse(sessionDataRaw);

      const matchedVehicle = parsed.vehicles.find(
        (v: any) => v.make?.value === selectedVehicle.vehicle_make,
      );

      if (matchedVehicle) {
        const registrationYearStr = extractYear(
          matchedVehicle.firstregistrationdate?.value,
        );
        const registrationYear = Number(registrationYearStr);
        const currentYear = new Date().getFullYear();

        if (!registrationYear || registrationYear < currentYear - 20) {
          setShowContactModal(true);
        } else {
          const updatedParsed = {
            ...parsed,
            vehicle_selected: matchedVehicle,
          };
          saveToSessionStorage({
            [ECICS_USER_INFO]: JSON.stringify(updatedParsed),
          });

          const singleVehicle = updatedParsed.vehicle_selected;
          postCheckVehicle({
            vehicle_make: singleVehicle.make?.value,
            vehicle_model: singleVehicle.model?.value,
          });
        }
      }
    } else {
      setSelected(selectedVehicle || null);
    }
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
        disabled={
          !selectedChasisNumber ||
          selectedChasisNumber === selected?.chasis_number
        }
        className='w-full'
      >
        {isReviewScreen ? 'Submit' : 'Continue'}
      </PrimaryButton>
    </>
  );

  const handleCloseUnMatchModal = () => {
    setShowUnMatchModal(false);
    setShowChooseVehicleModal(false);
  };

  return (
    <>
      {isMobile ? (
        <Drawer
          placement='bottom'
          open={visible && !showUnMatchModal}
          closable={!isReviewScreen}
          onClose={() => {
            if (!isReviewScreen) onClose?.();
          }}
          height='auto'
          className='custom-drawer rounded-t-xl'
        >
          {content}
        </Drawer>
      ) : (
        <Modal
          open={visible && !showUnMatchModal}
          onOk={handleClick}
          closable={!isReviewScreen}
          onCancel={() => {
            if (!isReviewScreen) {
              onClose?.();
            }
          }}
          maskClosable={false}
          keyboard={false}
          footer={null}
          centered
        >
          {content}
        </Modal>
      )}
      {showUnMatchModal && setRefreshSession && (
        <UnMatchVehicleModal
          onClose={handleCloseUnMatchModal}
          setRefreshSession={setRefreshSession}
        />
      )}
      {showContactModal && (
        <UnableQuote
          onClick={handleCloseContactModal}
          visible={showContactModal}
        />
      )}
    </>
  );
};

VehicleSelectionModal.defaultProps = defaultProps;

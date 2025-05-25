'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import AddIconSvg from '@/assets/icons/add-on/add.svg';
import ArrowDownCircleIconSvg from '@/assets/icons/add-on/arrow-down-circle.svg';
import BillIconSvg from '@/assets/icons/add-on/bill.svg';
import CarIconSvg from '@/assets/icons/add-on/car.svg';
import DeleteIconSvg from '@/assets/icons/add-on/delete.svg';
import FinishIconSvg from '@/assets/icons/add-on/finish.svg';
import MedicalKitIconSvg from '@/assets/icons/add-on/medical-kit.svg';
import PersonIconSvg from '@/assets/icons/add-on/person.svg';
import RepairIconSvg from '@/assets/icons/add-on/repair.svg';
import RoadSideIconSvg from '@/assets/icons/add-on/road-side.svg';

export const BillIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={BillIconSvg} {...props} />;
};

export const RoadSideIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={RoadSideIconSvg} {...props} />;
};

export const RepairIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={RepairIconSvg} {...props} />;
};

export const PersonIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={PersonIconSvg} {...props} />;
};

export const MedicalKitIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={MedicalKitIconSvg} {...props} />;
};
import KeyIconSvg from '@/assets/icons/add-on/key.svg';

export const KeyIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={KeyIconSvg} {...props} />;
};

export const FinishIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={FinishIconSvg} {...props} />;
};

export const AddIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={AddIconSvg} {...props} />;
};

export const DeleteIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={DeleteIconSvg} {...props} />;
};

export const CarIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={CarIconSvg} {...props} />;
};

export const ArrowDownCircleIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={ArrowDownCircleIconSvg} {...props} />;
};

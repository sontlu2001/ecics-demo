'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import VehicleDetailsIconSvg from '@/assets/icons/review/vehicle-details.svg';

const VehicleDetailsIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={VehicleDetailsIconSvg} {...props} />;
};

export default VehicleDetailsIcon;

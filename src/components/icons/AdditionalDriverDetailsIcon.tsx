'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import AdditionalDriverDetailsIconSvg from '@/assets/icons/review/additional-driver-details.svg';

const AdditionalDriverDetailsIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={AdditionalDriverDetailsIconSvg} {...props} />;
};

export default AdditionalDriverDetailsIcon;

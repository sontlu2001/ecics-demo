'use client';

import AdditionalDriverDetailsIconSvg from '@/assets/icons/review/additional-driver-details.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const AdditionalDriverDetailsIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={AdditionalDriverDetailsIconSvg} {...props} />;
};

export default AdditionalDriverDetailsIcon;

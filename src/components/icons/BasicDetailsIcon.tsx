'use client';

import BasicDetailsIconSvg from '@/assets/icons/review/basic-details.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const BasicDetailsIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={BasicDetailsIconSvg} {...props} />;
};

export default BasicDetailsIcon;

'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import BasicDetailsIconSvg from '@/assets/icons/review/basic-details.svg';

const BasicDetailsIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={BasicDetailsIconSvg} {...props} />;
};

export default BasicDetailsIcon;

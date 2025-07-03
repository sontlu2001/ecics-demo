'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import CheckCircleIconSvg from '@/assets/icons/check-circle.svg';

const CheckCircle = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={CheckCircleIconSvg} {...props} />;
};

export default CheckCircle;

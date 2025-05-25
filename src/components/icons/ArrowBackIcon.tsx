'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import ArrowBackIconSvg from '@/assets/icons/arrow-back.svg';

const ArrowBackIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={ArrowBackIconSvg} {...props} />;
};

export default ArrowBackIcon;

'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import ArrowUpIconSvg from '@/assets/icons/review/arrow-up.svg';

const ArrowUpIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={ArrowUpIconSvg} {...props} />;
};

export default ArrowUpIcon;

'use client';

import ArrowUpIconSvg from '@/assets/icons/review/arrow-up.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const ArrowUpIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={ArrowUpIconSvg} {...props} />;
};

export default ArrowUpIcon;

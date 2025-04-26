'use client';

import ArrowDownIconSvg from '@/assets/icons/review/arrow-down.svg';
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

const ArrowDownIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={ArrowDownIconSvg} {...props} />;
};

export default ArrowDownIcon;

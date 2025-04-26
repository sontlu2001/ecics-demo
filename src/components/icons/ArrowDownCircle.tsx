'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import ArrowDownCircleIconSvg from '@/assets/icons/add-on/arrow-down-circle.svg';

const ArrowDownCircleIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={ArrowDownCircleIconSvg} {...props} />;
};

export default ArrowDownCircleIcon;

'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import TickCircleIconSvg from '@/assets/icons/tick-circle.svg';

const TickCircleIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={TickCircleIconSvg} {...props} />;
};

export default TickCircleIcon;

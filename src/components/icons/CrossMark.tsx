'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import CrossMarkIconSvg from '@/assets/icons/cross-mark.svg';

const CrossMarkIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={CrossMarkIconSvg} {...props} />;
};

export default CrossMarkIcon;

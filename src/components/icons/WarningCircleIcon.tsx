'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import WarningCircleIconSvg from '@/assets/icons/warning_circle.svg';

const WarningCircleIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={WarningCircleIconSvg} {...props} />;
};

export default WarningCircleIcon;

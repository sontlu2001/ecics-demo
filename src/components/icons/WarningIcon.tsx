'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import WarningIconSvg from '@/assets/icons/warning.svg';

const WarningIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={WarningIconSvg} {...props} />;
};

export default WarningIcon;

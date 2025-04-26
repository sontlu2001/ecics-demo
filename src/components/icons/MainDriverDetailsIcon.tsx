'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import MainDriverDetailsIconSvg from '@/assets/icons/review/main-driver-details.svg';

const MainDriverDetailsIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={MainDriverDetailsIconSvg} {...props} />;
};

export default MainDriverDetailsIcon;

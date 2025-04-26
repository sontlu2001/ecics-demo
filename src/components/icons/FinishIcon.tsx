'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import FinishIconSvg from '@/assets/icons/add-on/finish.svg';

const FinishIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={FinishIconSvg} {...props} />;
};

export default FinishIcon;

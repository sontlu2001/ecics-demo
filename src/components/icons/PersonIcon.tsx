'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import PersonIconSvg from '@/assets/icons/add-on/person.svg';

const PersonIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={PersonIconSvg} {...props} />;
};

export default PersonIcon;

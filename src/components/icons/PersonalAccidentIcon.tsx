'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import PersonalAccidentIconSvg from '@/assets/icons/add-on/personal-accident.svg';

const PersonalAccidentIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={PersonalAccidentIconSvg} {...props} />;
};

export default PersonalAccidentIcon;

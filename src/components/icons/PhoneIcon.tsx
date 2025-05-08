'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import PhoneIconSvg from '@/assets/icons/basic-detail/phone.svg';

const PhoneIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  const { className, ...rest } = props;

  return <SvgIcon svg={PhoneIconSvg} className={`${className}`} {...rest} />;
};

export default PhoneIcon;

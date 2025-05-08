'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import MailIconSvg from '@/assets/icons/basic-detail/mail.svg';

const MailIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  const { className, ...rest } = props;

  return <SvgIcon svg={MailIconSvg} className={`${className}`} {...rest} />;
};

export default MailIcon;

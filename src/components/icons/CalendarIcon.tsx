'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import CalendarIconSvg from '@/assets/icons/calendar.svg';

const CalendarIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  const { className, ...rest } = props;

  return <SvgIcon svg={CalendarIconSvg} className={`${className}`} {...rest} />;
};

export default CalendarIcon;

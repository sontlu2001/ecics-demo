'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import EditDriver from '@/assets/icons/edit-driver.svg';

const IconEditDriver = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={EditDriver} {...props} />;
};

export default IconEditDriver;

'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import RepairIconSvg from '@/assets/icons/add-on/repair.svg';

const RepairIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={RepairIconSvg} {...props} />;
};

export default RepairIcon;

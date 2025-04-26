'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import PlanNormalIconSvg from '@/assets/icons/plan-normal.svg';

const PlanNormalIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={PlanNormalIconSvg} {...props} />;
};

export default PlanNormalIcon;

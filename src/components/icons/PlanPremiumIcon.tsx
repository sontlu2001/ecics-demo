'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import PlanPremiumIconSvg from '@/assets/icons/plan-premium.svg';

const PlanPremiumIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={PlanPremiumIconSvg} {...props} />;
};

export default PlanPremiumIcon;

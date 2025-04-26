'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import PolicyPlanIconSvg from '@/assets/icons/review/policy-plan.svg';

const PolicyPlanIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={PolicyPlanIconSvg} {...props} />;
};

export default PolicyPlanIcon;

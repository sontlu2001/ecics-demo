'use client';

import SvgIcon, { SvgIconProps } from '@/components/SvgIcon';

import CouponIconSvg from '@/assets/icons/coupon.svg';

const CouponIcon = (props: Omit<SvgIconProps, 'svg'>) => {
  return <SvgIcon svg={CouponIconSvg} {...props} />;
};

export default CouponIcon;
